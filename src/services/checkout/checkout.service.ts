import {
  CheckoutAuthenticationException,
  CheckoutServiceException,
  CheckoutValidationException,
} from "@/exceptions/checkout/checkout.exceptions"
import { createExperienciasRepository } from "@/repositories/experiencias/experiencias.repository"
import { createOrdenesItemsRepository } from "@/repositories/ordenes-items/ordenes-items.repository"
import { createOrdenesRepository } from "@/repositories/ordenes/ordenes.repository"
import { createPaquetesFechasRepository } from "@/repositories/paquetes-fechas/paquetes-fechas.repository"
import { createReservasRepository } from "@/repositories/reservas/reservas.repository"
import { createExperienciasService } from "@/services/experiencias/experiencias.service"
import { createOrdenesItemsService } from "@/services/ordenes-items/ordenes-items.service"
import { createOrdenesService } from "@/services/ordenes/ordenes.service"
import { createPaquetesFechasService } from "@/services/paquetes-fechas/paquetes-fechas.service"
import { createPaymentsService } from "@/services/payments/payments.service"
import { createReservasService } from "@/services/reservas/reservas.service"
import { createTransactionalEmailService } from "@/services/notifications/transactional-email.service"
import type { CartItem } from "@/types/cart/cart.types"
import type {
  CheckoutSubmitInput,
  CheckoutSubmitResult,
  CheckoutUserContext,
} from "@/types/checkout/checkout.types"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OrdenMetodoPago } from "@/types/ordenes/ordenes.types"
import type { ReservasInsert } from "@/types/reservas/reservas.types"

function buildReservationNotes(
  item: CartItem,
  input: CheckoutSubmitInput,
  user: CheckoutUserContext,
  orderReference: string,
) {
  return [
    `Order reference: ${orderReference}`,
    `Checkout item: ${item.kind}`,
    `Checkout label: ${item.name}`,
    `Usuario autenticado: ${user.id}`,
    `Contacto: ${input.contact.firstName} ${input.contact.lastName}`,
    `Email contacto: ${input.contact.email}`,
    `Telefono contacto: ${input.contact.phone}`,
    `Pasajero: ${input.passenger.fullName}`,
    `Documento: ${input.passenger.documentNumber}`,
    `Nacimiento: ${input.passenger.birthDate}`,
    `Nacionalidad: ${input.passenger.nationality}`,
    input.passenger.specialRequirements
      ? `Observaciones: ${input.passenger.specialRequirements}`
      : null,
    `Metodo de pago seleccionado: ${input.paymentMethod}`,
  ]
    .filter(Boolean)
    .join("\n")
}

function buildOrderReference() {
  const date = new Date()
  const year = date.getFullYear()
  const randomSuffix = Math.random().toString(36).slice(2, 8).toUpperCase()

  return `AP-${year}-${randomSuffix}`
}

function mapCheckoutPaymentMethod(method: CheckoutSubmitInput["paymentMethod"]): OrdenMetodoPago {
  if (method === "mercadopago") {
    return "mercadopago_checkout_pro"
  }

  if (method === "transferencia") {
    return "bank_transfer"
  }

  return "cash_local"
}

export class CheckoutService {
  private readonly reservasService
  private readonly paquetesFechasService
  private readonly experienciasService
  private readonly ordenesService
  private readonly ordenesItemsService
  private readonly paymentsService
  private readonly transactionalEmailService

  constructor(supabase: DatabaseClient) {
    this.reservasService = createReservasService(createReservasRepository(supabase))
    this.paquetesFechasService = createPaquetesFechasService(
      createPaquetesFechasRepository(supabase),
    )
    this.experienciasService = createExperienciasService(
      createExperienciasRepository(supabase),
    )
    this.ordenesService = createOrdenesService(createOrdenesRepository(supabase))
    this.ordenesItemsService = createOrdenesItemsService(
      createOrdenesItemsRepository(supabase),
    )
    this.paymentsService = createPaymentsService(supabase)
    this.transactionalEmailService = createTransactionalEmailService(supabase)
  }

  private async notifyOrderCreated(orderId: string) {
    try {
      await this.transactionalEmailService.sendOrderCreated(orderId)
    } catch (error) {
      console.error("Failed to send order created email", error)
    }
  }

  async submitCheckout(
    input: CheckoutSubmitInput,
    user: CheckoutUserContext | null,
  ): Promise<CheckoutSubmitResult> {
    try {
      if (!user) {
        throw new CheckoutAuthenticationException()
      }

      if (input.items.length === 0) {
        throw new CheckoutValidationException("Cart is empty")
      }

      const orderReference = buildOrderReference()
      const paymentMethod = mapCheckoutPaymentMethod(input.paymentMethod)
      const order = await this.ordenesService.create({
        usuario_id: user.id,
        codigo_referencia: orderReference,
        estado: "pendiente",
        estado_pago: "pending",
        metodo_pago: paymentMethod,
        total: input.items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0,
        ),
        moneda: input.items[0]?.moneda ?? "ARS",
        contacto: {
          firstName: input.contact.firstName,
          lastName: input.contact.lastName,
          email: input.contact.email,
          phone: input.contact.phone,
        },
        pasajero_principal: {
          fullName: input.passenger.fullName,
          documentNumber: input.passenger.documentNumber,
          birthDate: input.passenger.birthDate,
          nationality: input.passenger.nationality,
          specialRequirements: input.passenger.specialRequirements,
        },
        notas: `Checkout iniciado ${new Date().toISOString()}`,
      })

      const reservations = []

      for (const item of input.items) {
        const reservation = await this.createReservationForItem(
          item,
          input,
          user,
          orderReference,
        )

        reservations.push({
          reservationId: reservation.id,
          kind: item.kind,
          quantity: reservation.cantidad_pasajeros,
          unitPrice: reservation.precio_unitario,
          totalPrice: reservation.precio_total,
        })

        await this.ordenesItemsService.create({
          orden_id: order.id,
          reserva_id: reservation.id,
          tipo: item.kind,
          nombre: item.name,
          descripcion_corta: item.description,
          imagen_url: item.image,
          cantidad: item.quantity,
          precio_unitario: item.unitPrice,
          precio_total: item.unitPrice * item.quantity,
          moneda: item.moneda,
          metadata: {
            cartItemId: item.id,
            paqueteFechaId: item.paqueteFechaId,
            experienciaId: item.experienciaId,
          },
        })
      }

      const successUrl = `/checkout/success?orderId=${order.id}&paymentMethod=${input.paymentMethod}`
      const errorUrl = `/checkout/error?orderId=${order.id}&paymentMethod=${input.paymentMethod}`
      const transferUrl = `/checkout/transferencia?orderId=${order.id}&paymentMethod=${input.paymentMethod}`
      const initialOrderSummary = {
        orderId: order.id,
        reference: order.codigo_referencia,
        status: order.estado,
        paymentStatus: order.estado_pago,
        total: Number(order.total),
        currency: order.moneda,
      }

      if (input.paymentMethod === "mercadopago") {
        const payment = await this.paymentsService.createMercadoPagoCheckoutPro({
          orderId: order.id,
          payer: {
            email: input.contact.email,
            fullName: input.passenger.fullName,
            documentNumber: input.passenger.documentNumber,
          },
          successPath: successUrl,
          failurePath: errorUrl,
          pendingPath: successUrl,
        })
        const orderDetail = await this.paymentsService.getCheckoutOrderSummary(
          order.id,
        )
        await this.notifyOrderCreated(order.id)

        return {
          paymentMethod: input.paymentMethod,
          order: {
            orderId: orderDetail.orderId,
            reference: orderDetail.reference,
            status: orderDetail.status,
            paymentStatus: orderDetail.paymentStatus,
            total: orderDetail.total,
            currency: orderDetail.currency,
          },
          payment: orderDetail.payment,
          reservations,
          redirectUrl: payment.initPoint,
          successUrl,
          bankTransfer: null,
        }
      }

      if (input.paymentMethod === "transferencia") {
        const bankTransfer = await this.paymentsService.createBankTransfer({
          orderId: order.id,
          payer: {
            email: input.contact.email,
            fullName: input.passenger.fullName,
            documentNumber: input.passenger.documentNumber,
          },
          note: `Checkout web ${new Date().toISOString()}`,
        })
        const orderDetail = await this.paymentsService.getCheckoutOrderSummary(
          order.id,
        )
        await this.notifyOrderCreated(order.id)

        return {
          paymentMethod: input.paymentMethod,
          order: {
            orderId: orderDetail.orderId,
            reference: orderDetail.reference,
            status: orderDetail.status,
            paymentStatus: orderDetail.paymentStatus,
            total: orderDetail.total,
            currency: orderDetail.currency,
          },
          payment: orderDetail.payment,
          reservations,
          redirectUrl: transferUrl,
          successUrl,
          bankTransfer,
        }
      }

      const cashPayment = await this.paymentsService.createCashLocalPayment(
        order.id,
        "Reserva para pago presencial en sucursal",
      )
      await this.notifyOrderCreated(order.id)

      return {
        paymentMethod: input.paymentMethod,
        order: {
          ...initialOrderSummary,
          status: "pago_pendiente",
          paymentStatus: "requires_action",
        },
        payment: {
          paymentId: cashPayment.paymentId,
          method: "cash_local",
          provider: "cash_local",
          status: cashPayment.status,
          amount: cashPayment.amount,
          currency: cashPayment.currency,
          externalReference: `cash:${cashPayment.paymentId}`,
          redirectUrl: null,
          expiresAt: null,
          receiptReference: null,
          hasReceipt: false,
          receiptUrl: null,
        },
        reservations,
        redirectUrl: successUrl,
        successUrl,
        bankTransfer: null,
      }
    } catch (error) {
      if (
        error instanceof CheckoutAuthenticationException ||
        error instanceof CheckoutValidationException
      ) {
        throw error
      }

      throw new CheckoutServiceException("submitCheckout", error)
    }
  }

  async getOrderSummary(orderId: string, user: CheckoutUserContext | null) {
    try {
      if (!user) {
        throw new CheckoutAuthenticationException()
      }

      const order = await this.ordenesService.getById(orderId)

      if (order.usuario_id !== user.id) {
        throw new CheckoutValidationException("Order not found")
      }

      const summary = await this.paymentsService.getCheckoutOrderSummary(orderId)

      return summary
    } catch (error) {
      if (
        error instanceof CheckoutAuthenticationException ||
        error instanceof CheckoutValidationException
      ) {
        throw error
      }

      throw new CheckoutServiceException("getOrderSummary", error)
    }
  }

  async listUserOrders(user: CheckoutUserContext | null) {
    try {
      if (!user) {
        throw new CheckoutAuthenticationException()
      }

      return await this.paymentsService.listUserCheckoutOrders(user.id)
    } catch (error) {
      if (error instanceof CheckoutAuthenticationException) {
        throw error
      }

      throw new CheckoutServiceException("listUserOrders", error)
    }
  }

  private async createReservationForItem(
    item: CartItem,
    input: CheckoutSubmitInput,
    user: CheckoutUserContext,
    orderReference: string,
  ) {
    let reservationPayload: ReservasInsert

    if (item.kind === "paquete") {
      if (!item.paqueteFechaId) {
        throw new CheckoutValidationException(
          "Package checkout items require paqueteFechaId",
        )
      }

      const paqueteFecha = await this.paquetesFechasService.getById(
        item.paqueteFechaId,
      )

      if (paqueteFecha.activo === false) {
        throw new CheckoutValidationException("Selected package date is inactive")
      }

      if (item.quantity > paqueteFecha.cupo_disponible) {
        throw new CheckoutValidationException(
          "Selected passenger count exceeds the available capacity",
        )
      }

      reservationPayload = {
        usuario_id: user.id,
        paquete_fecha_id: paqueteFecha.id,
        tipo: "paquete",
        estado: "pendiente",
        cantidad_pasajeros: item.quantity,
        precio_unitario: paqueteFecha.precio_por_persona,
        precio_total: paqueteFecha.precio_por_persona * item.quantity,
        moneda: paqueteFecha.moneda ?? item.moneda,
        notas: buildReservationNotes(item, input, user, orderReference),
      }
    } else {
      if (!item.experienciaId) {
        throw new CheckoutValidationException(
          "Experience checkout items require experienciaId",
        )
      }

      const experiencia = await this.experienciasService.getById(item.experienciaId)

      if (experiencia.activo === false) {
        throw new CheckoutValidationException("Selected experience is inactive")
      }

      if (!experiencia.precio) {
        throw new CheckoutValidationException(
          "Selected experience does not have a valid price",
        )
      }

      reservationPayload = {
        usuario_id: user.id,
        experiencia_id: experiencia.id,
        tipo: "experiencia",
        estado: "pendiente",
        cantidad_pasajeros: item.quantity,
        precio_unitario: experiencia.precio,
        precio_total: experiencia.precio * item.quantity,
        moneda: experiencia.moneda ?? item.moneda,
        notas: buildReservationNotes(item, input, user, orderReference),
      }
    }

    return this.reservasService.create(reservationPayload)
  }
}

export function createCheckoutService(supabase: DatabaseClient) {
  return new CheckoutService(supabase)
}
