import { CheckoutAuthenticationException, CheckoutServiceException, CheckoutValidationException } from "@/exceptions/checkout/checkout.exceptions"
import { createExperienciasRepository } from "@/repositories/experiencias/experiencias.repository"
import { createPaquetesFechasRepository } from "@/repositories/paquetes-fechas/paquetes-fechas.repository"
import { createReservasRepository } from "@/repositories/reservas/reservas.repository"
import { createExperienciasService } from "@/services/experiencias/experiencias.service"
import { createPaquetesFechasService } from "@/services/paquetes-fechas/paquetes-fechas.service"
import { createPaymentsService } from "@/services/payments/payments.service"
import { createReservasService } from "@/services/reservas/reservas.service"
import type { DatabaseClient } from "@/types/database/database.types"
import type { CheckoutSubmitInput, CheckoutSubmitResult, CheckoutUserContext } from "@/types/checkout/checkout.types"
import type { CartItem } from "@/types/cart/cart.types"
import type { ReservasInsert } from "@/types/reservas/reservas.types"

function buildReservationNotes(
  item: CartItem,
  input: CheckoutSubmitInput,
  user: CheckoutUserContext,
) {
  return [
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

export class CheckoutService {
  private readonly reservasService
  private readonly paquetesFechasService
  private readonly experienciasService
  private readonly paymentsService

  constructor(supabase: DatabaseClient) {
    this.reservasService = createReservasService(createReservasRepository(supabase))
    this.paquetesFechasService = createPaquetesFechasService(
      createPaquetesFechasRepository(supabase),
    )
    this.experienciasService = createExperienciasService(
      createExperienciasRepository(supabase),
    )
    this.paymentsService = createPaymentsService(supabase)
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

      if (input.paymentMethod !== "efectivo" && input.items.length > 1) {
        throw new CheckoutValidationException(
          "Online payments currently support a single reservation per checkout",
        )
      }

      const reservations = []

      for (const item of input.items) {
        const reservation = await this.createReservationForItem(item, input, user)

        reservations.push({
          reservationId: reservation.id,
          kind: item.kind,
          quantity: reservation.cantidad_pasajeros,
          unitPrice: reservation.precio_unitario,
          totalPrice: reservation.precio_total,
        })
      }

      const firstReservation = reservations[0]
      const successUrl = `/checkout/success?paymentMethod=${input.paymentMethod}`

      if (input.paymentMethod === "mercadopago") {
        const payment = await this.paymentsService.createMercadoPagoCheckoutPro({
          reservationId: firstReservation.reservationId,
          payer: {
            email: input.contact.email,
            fullName: input.passenger.fullName,
            documentNumber: input.passenger.documentNumber,
          },
          successPath: successUrl,
          failurePath: successUrl,
          pendingPath: successUrl,
        })

        return {
          paymentMethod: input.paymentMethod,
          reservations,
          redirectUrl: payment.initPoint,
          successUrl,
          bankTransfer: null,
        }
      }

      if (input.paymentMethod === "transferencia") {
        const bankTransfer = await this.paymentsService.createBankTransfer({
          reservationId: firstReservation.reservationId,
          payer: {
            email: input.contact.email,
            fullName: input.passenger.fullName,
            documentNumber: input.passenger.documentNumber,
          },
          note: `Checkout web ${new Date().toISOString()}`,
        })

        return {
          paymentMethod: input.paymentMethod,
          reservations,
          redirectUrl: successUrl,
          successUrl,
          bankTransfer,
        }
      }

      return {
        paymentMethod: input.paymentMethod,
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

  private async createReservationForItem(
    item: CartItem,
    input: CheckoutSubmitInput,
    user: CheckoutUserContext,
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
        notas: buildReservationNotes(item, input, user),
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
        notas: buildReservationNotes(item, input, user),
      }
    }

    return this.reservasService.create(reservationPayload)
  }
}

export function createCheckoutService(supabase: DatabaseClient) {
  return new CheckoutService(supabase)
}
