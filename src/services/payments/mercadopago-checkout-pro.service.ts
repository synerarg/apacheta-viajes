import {
  buildMercadoPagoPreferenceBody,
  createCheckoutProPreference,
  getMercadoPagoPayment,
} from "@/lib/mercadopago/client"
import type { PaymentsRepository } from "@/repositories/payments/payments.repository"
import type { TransactionalEmailService } from "@/services/notifications/transactional-email.service"
import type {
  CreateMercadoPagoCheckoutProInput,
  MercadoPagoCheckoutProResult,
  MercadoPagoWebhookResult,
} from "@/types/payments/payments.types"

function resolvePaymentStatusFromMercadoPago(status?: string | null) {
  if (status === "approved") {
    return "approved" as const
  }

  if (status === "rejected" || status === "cancelled" || status === "refunded") {
    return "rejected" as const
  }

  return "pending" as const
}

function resolveOrderStateFromPaymentStatus(status: ReturnType<typeof resolvePaymentStatusFromMercadoPago>) {
  if (status === "approved") {
    return {
      orderStatus: "pagada" as const,
      orderPaymentStatus: "approved" as const,
      reservationStatus: "pagada" as const,
    }
  }

  if (status === "rejected") {
    return {
      orderStatus: "cancelada" as const,
      orderPaymentStatus: "rejected" as const,
      reservationStatus: "cancelada" as const,
    }
  }

  return {
    orderStatus: "pago_pendiente" as const,
    orderPaymentStatus: "pending" as const,
    reservationStatus: null,
  }
}

function buildWebhookIdempotencyToken(paymentId: string, status: string) {
  return `[mp_webhook:${paymentId}:${status}]`
}

export class MercadoPagoCheckoutProService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly transactionalEmailService?: TransactionalEmailService,
  ) {}

  private async notifyWebhookStatus(
    paymentId: string,
    normalizedStatus: "approved" | "pending" | "rejected",
  ) {
    if (!this.transactionalEmailService) {
      return
    }

    try {
      if (normalizedStatus === "approved") {
        await this.transactionalEmailService.sendPaymentApproved(paymentId)
        return
      }

      await this.transactionalEmailService.sendPaymentPendingOrError(paymentId)
    } catch (error) {
      console.error("Failed to send Mercado Pago status email", error)
    }
  }

  async createCheckoutPreference(
    input: CreateMercadoPagoCheckoutProInput,
  ): Promise<MercadoPagoCheckoutProResult> {
    const { order, items, user } =
      await this.paymentsRepository.getOrderContext(input.orderId)
    const externalReference = `MP-${crypto.randomUUID()}`
    const payment = await this.paymentsRepository.createPayment({
      orden_id: order.id,
      metodo: "mercadopago_checkout_pro",
      proveedor: "mercadopago",
      estado: "pending",
      monto: Number(order.total),
      moneda: order.moneda,
      external_reference: externalReference,
      metadata: {
        itemCount: items.length,
      },
      updated_at: new Date().toISOString(),
    })

    await this.paymentsRepository.createPaymentEvent({
      pago_id: payment.id,
      tipo: "mercadopago.preference_requested",
      estado: payment.estado,
      mensaje: "Creando preferencia de Mercado Pago Checkout Pro",
      payload: {
        orderId: order.id,
      },
    })

    const preference = await createCheckoutProPreference(
      buildMercadoPagoPreferenceBody({
        externalReference,
        items: items.map((item) => ({
          id: item.id,
          title: item.nombre,
          description: item.descripcion_corta ?? undefined,
          quantity: item.cantidad,
          unit_price: Number(item.precio_unitario),
          currency_id: item.moneda,
        })),
        payerEmail: input.payer?.email ?? user?.email ?? null,
        successPath:
          input.successPath ??
          `/checkout/success?orderId=${order.id}&paymentMethod=mercadopago`,
        failurePath:
          input.failurePath ??
          `/checkout/success?orderId=${order.id}&paymentMethod=mercadopago`,
        pendingPath:
          input.pendingPath ??
          `/checkout/success?orderId=${order.id}&paymentMethod=mercadopago`,
      }),
    )

    await this.paymentsRepository.updatePaymentById(payment.id, {
      provider_reference: preference.id,
      redirect_url: preference.init_point ?? preference.sandbox_init_point ?? null,
      metadata: {
        itemCount: items.length,
        preferenceId: preference.id,
      },
      updated_at: new Date().toISOString(),
    })

    await this.paymentsRepository.updateOrderById(order.id, {
      estado: "pago_pendiente",
      estado_pago: "pending",
      updated_at: new Date().toISOString(),
    })

    await this.paymentsRepository.createPaymentEvent({
      pago_id: payment.id,
      tipo: "mercadopago.preference_created",
      estado: "pending",
      mensaje: `Mercado Pago Checkout Pro creado. preference_id=${preference.id}`,
      payload: {
        preferenceId: preference.id,
        initPoint: preference.init_point ?? null,
      },
    })

    return {
      provider: "mercadopago_checkout_pro",
      orderId: order.id,
      paymentId: payment.id,
      preferenceId: preference.id,
      initPoint: preference.init_point ?? null,
      sandboxInitPoint: preference.sandbox_init_point ?? null,
      externalReference,
    }
  }

  async handleWebhook(paymentId: string): Promise<MercadoPagoWebhookResult | null> {
    const mercadopagoPayment = await getMercadoPagoPayment(paymentId)
    const externalReference = mercadopagoPayment.external_reference

    if (!externalReference) {
      return null
    }

    const paymentRecord =
      await this.paymentsRepository.getPaymentByExternalReference(externalReference)
    const paymentStatus = mercadopagoPayment.status ?? "unknown"
    const idempotencyToken = buildWebhookIdempotencyToken(paymentId, paymentStatus)
    const previousEvents = await this.paymentsRepository.listPaymentEvents(
      paymentRecord.id,
    )

    if (
      previousEvents.some((event) => event.mensaje?.includes(idempotencyToken))
    ) {
      const orderContext = await this.paymentsRepository.getOrderContext(
        paymentRecord.orden_id,
      )

      return {
        orderId: paymentRecord.orden_id,
        paymentId: paymentRecord.id,
        mercadopagoPaymentId: String(mercadopagoPayment.id),
        mercadopagoStatus: paymentStatus,
        paymentStatus: paymentRecord.estado,
        orderStatus: orderContext.order.estado,
        alreadyProcessed: true,
      }
    }

    const normalizedStatus = resolvePaymentStatusFromMercadoPago(paymentStatus)
    const nextState = resolveOrderStateFromPaymentStatus(normalizedStatus)
    const orderContext = await this.paymentsRepository.getOrderContext(
      paymentRecord.orden_id,
    )

    await this.paymentsRepository.updatePaymentById(paymentRecord.id, {
      estado: normalizedStatus,
      provider_reference: String(mercadopagoPayment.id),
      approved_at:
        normalizedStatus === "approved" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })

    await this.paymentsRepository.updateOrderById(orderContext.order.id, {
      estado: nextState.orderStatus,
      estado_pago: nextState.orderPaymentStatus,
      updated_at: new Date().toISOString(),
    })

    if (nextState.reservationStatus) {
      await this.paymentsRepository.updateOrderReservationsStatus(
        orderContext.order.id,
        nextState.reservationStatus,
        `Mercado Pago webhook ${paymentStatus}. payment_id=${paymentId}`,
      )
    }

    await this.paymentsRepository.createPaymentEvent({
      pago_id: paymentRecord.id,
      tipo: "mercadopago.webhook_received",
      estado: normalizedStatus,
      mensaje: `${idempotencyToken} Mercado Pago webhook recibido. payment_id=${paymentId} status=${paymentStatus}`,
      payload: {
        mercadopagoPaymentId: mercadopagoPayment.id,
        status: paymentStatus,
      },
    })

    await this.notifyWebhookStatus(paymentRecord.id, normalizedStatus)

    return {
      orderId: orderContext.order.id,
      paymentId: paymentRecord.id,
      mercadopagoPaymentId: String(mercadopagoPayment.id),
      mercadopagoStatus: paymentStatus,
      paymentStatus: normalizedStatus,
      orderStatus: nextState.orderStatus,
      alreadyProcessed: false,
    }
  }
}
