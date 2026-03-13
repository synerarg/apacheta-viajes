import {
  buildMercadoPagoPreferenceBody,
  createCheckoutProPreference,
  getMercadoPagoPayment,
} from "@/lib/mercadopago/client"
import type { PaymentsRepository } from "@/repositories/payments/payments.repository"
import type {
  CreateMercadoPagoCheckoutProInput,
  MercadoPagoCheckoutProResult,
  MercadoPagoWebhookResult,
} from "@/types/payments/payments.types"

function resolveReservationTitle(
  reservationId: string,
  explicitTitle?: string,
) {
  return explicitTitle ?? `Reserva ${reservationId.slice(0, 8).toUpperCase()}`
}

function resolveStatusFromMercadoPago(status?: string | null) {
  if (status === "approved") {
    return "pagada" as const
  }

  return "pendiente" as const
}

function buildWebhookIdempotencyToken(paymentId: string, status: string) {
  return `[mp_webhook:${paymentId}:${status}]`
}

export class MercadoPagoCheckoutProService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async createCheckoutPreference(
    input: CreateMercadoPagoCheckoutProInput,
  ): Promise<MercadoPagoCheckoutProResult> {
    const { reservation, user } =
      await this.paymentsRepository.getReservationContext(input.reservationId)
    const currency = reservation.moneda ?? "ARS"
    const amount = Number(reservation.precio_total)
    const title = resolveReservationTitle(reservation.id, input.title)

    const preference = await createCheckoutProPreference(
      buildMercadoPagoPreferenceBody({
        reservationId: reservation.id,
        title,
        description: input.description,
        amount,
        currency,
        payerEmail: input.payer?.email ?? user?.email ?? null,
        successPath:
          input.successPath ??
          `/payments/mercadopago/success?reservationId=${reservation.id}`,
        failurePath:
          input.failurePath ??
          `/payments/mercadopago/failure?reservationId=${reservation.id}`,
        pendingPath:
          input.pendingPath ??
          `/payments/mercadopago/pending?reservationId=${reservation.id}`,
      }),
    )

    await this.paymentsRepository.appendReservationNote(
      reservation.id,
      `Mercado Pago Checkout Pro creado. preference_id=${preference.id}`,
    )

    return {
      provider: "mercadopago_checkout_pro",
      reservationId: reservation.id,
      preferenceId: preference.id,
      initPoint: preference.init_point ?? null,
      sandboxInitPoint: preference.sandbox_init_point ?? null,
      externalReference: reservation.id,
    }
  }

  async handleWebhook(paymentId: string): Promise<MercadoPagoWebhookResult | null> {
    const payment = await getMercadoPagoPayment(paymentId)
    const reservationId = payment.external_reference

    if (!reservationId) {
      return null
    }

    const { reservation } =
      await this.paymentsRepository.getReservationContext(reservationId)
    const nextStatus = resolveStatusFromMercadoPago(payment.status)
    const paymentStatus = payment.status ?? "unknown"
    const idempotencyToken = buildWebhookIdempotencyToken(
      paymentId,
      paymentStatus,
    )
    const note = `${idempotencyToken} Mercado Pago webhook recibido. payment_id=${paymentId} status=${paymentStatus}`

    if (reservation.notas?.includes(idempotencyToken)) {
      return {
        reservationId,
        mercadopagoPaymentId: String(payment.id),
        mercadopagoStatus: paymentStatus,
        reservationStatus: reservation.estado ?? nextStatus,
        alreadyProcessed: true,
      }
    }

    if (nextStatus === "pagada" && reservation.estado !== "pagada") {
      await this.paymentsRepository.updateReservationStatus(
        reservationId,
        "pagada",
        note,
      )
    } else {
      await this.paymentsRepository.appendReservationNote(reservationId, note)
    }

    return {
      reservationId,
      mercadopagoPaymentId: String(payment.id),
      mercadopagoStatus: paymentStatus,
      reservationStatus: nextStatus,
      alreadyProcessed: false,
    }
  }
}
