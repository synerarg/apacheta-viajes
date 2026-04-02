import {
  CheckoutAuthenticationException,
  CheckoutServiceException,
  CheckoutValidationException,
} from "@/exceptions/checkout/checkout.exceptions"
import {
  BankTransferConfigurationException,
  MercadoPagoConfigurationException,
} from "@/exceptions/payments/payments.exceptions"
import {
  getBankTransferConfig,
  getMercadoPagoConfig,
} from "@/lib/payments/payments.config"
import { createExperienciasRepository } from "@/repositories/experiencias/experiencias.repository"
import { createCheckoutProfilesRepository } from "@/repositories/checkout-profiles/checkout-profiles.repository"
import { createOrdenesItemsRepository } from "@/repositories/ordenes-items/ordenes-items.repository"
import { createOrdenesRepository } from "@/repositories/ordenes/ordenes.repository"
import { createPaquetesFechasRepository } from "@/repositories/paquetes-fechas/paquetes-fechas.repository"
import { createReservasRepository } from "@/repositories/reservas/reservas.repository"
import { createExperienciasService } from "@/services/experiencias/experiencias.service"
import { createCheckoutProfilesService } from "@/services/checkout-profiles/checkout-profiles.service"
import { createOrdenesItemsService } from "@/services/ordenes-items/ordenes-items.service"
import { createOrdenesService } from "@/services/ordenes/ordenes.service"
import { createPaquetesFechasService } from "@/services/paquetes-fechas/paquetes-fechas.service"
import { createPaymentsService } from "@/services/payments/payments.service"
import { createReservasService } from "@/services/reservas/reservas.service"
import { createTransactionalEmailService } from "@/services/notifications/transactional-email.service"
import type { CartItem } from "@/types/cart/cart.types"
import type {
  CheckoutProfileResult,
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
  const contactName = [input.contact.firstName, input.contact.lastName]
    .filter(Boolean)
    .join(" ")

  return [
    `Order reference: ${orderReference}`,
    `Checkout item: ${item.kind}`,
    `Checkout label: ${item.name}`,
    `Usuario autenticado: ${user.id}`,
    `Contacto: ${contactName || input.passenger.fullName}`,
    `Email contacto: ${input.contact.email}`,
    `Telefono contacto: ${input.contact.phone}`,
    `Pasajero: ${input.passenger.fullName}`,
    `Documento: ${input.passenger.documentNumber}`,
    input.passenger.birthDate ? `Nacimiento: ${input.passenger.birthDate}` : null,
    input.passenger.nationality
      ? `Nacionalidad: ${input.passenger.nationality}`
      : null,
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

function normalizeOptionalText(value?: string | null) {
  const normalized = value?.trim()

  return normalized ? normalized : undefined
}

function buildPaymentPayer(input: CheckoutSubmitInput) {
  return {
    email: input.contact.email,
    fullName: input.passenger.fullName,
    documentNumber: input.passenger.documentNumber,
  }
}

function mapCheckoutPaymentMethod(method: CheckoutSubmitInput["paymentMethod"]): OrdenMetodoPago {
  if (method === "mercadopago") {
    return "mercadopago_checkout_pro"
  }

  if (method === "transferencia") {
    return "bank_transfer"
  }

  throw new CheckoutValidationException("Unsupported checkout payment method")
}

function assertCheckoutPaymentConfigured(
  paymentMethod: CheckoutSubmitInput["paymentMethod"],
) {
  try {
    if (paymentMethod === "mercadopago") {
      getMercadoPagoConfig()
      return
    }

    if (paymentMethod === "transferencia") {
      getBankTransferConfig()
    }
  } catch (error) {
    if (
      error instanceof MercadoPagoConfigurationException ||
      error instanceof BankTransferConfigurationException
    ) {
      throw new CheckoutValidationException(
        error instanceof MercadoPagoConfigurationException
          ? "Mercado Pago no está configurado correctamente."
          : "La transferencia bancaria no está configurada correctamente.",
        {
          cause:
            error.cause instanceof Error ? error.cause.message : error.message,
        },
      )
    }

    throw error
  }
}

export class CheckoutService {
  private readonly checkoutProfilesService
  private readonly reservasService
  private readonly paquetesFechasService
  private readonly experienciasService
  private readonly ordenesService
  private readonly ordenesItemsService
  private readonly paymentsService
  private readonly transactionalEmailService

  constructor(supabase: DatabaseClient) {
    this.checkoutProfilesService = createCheckoutProfilesService(
      createCheckoutProfilesRepository(supabase),
    )
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

  private async syncSavedProfile(
    input: CheckoutSubmitInput,
    user: CheckoutUserContext,
  ) {
    if (input.saveProfile) {
      await this.checkoutProfilesService.upsertByUsuarioId(user.id, {
        contact_first_name: input.contact.firstName,
        contact_last_name: input.contact.lastName ?? null,
        contact_email: input.contact.email,
        contact_phone: input.contact.phone,
        passenger_full_name: input.passenger.fullName,
        passenger_document_number: input.passenger.documentNumber,
        passenger_birth_date: input.passenger.birthDate ?? null,
        passenger_nationality: input.passenger.nationality ?? null,
        passenger_special_requirements:
          input.passenger.specialRequirements ?? null,
      })
      return
    }

    await this.checkoutProfilesService.deleteByUsuarioId(user.id)
  }

  async submitCheckout(
    input: CheckoutSubmitInput,
    user: CheckoutUserContext | null,
  ): Promise<CheckoutSubmitResult> {
    try {
      const normalizedInput: CheckoutSubmitInput = {
        ...input,
        contact: {
          firstName: input.contact.firstName.trim(),
          lastName: normalizeOptionalText(input.contact.lastName),
          email: input.contact.email.trim(),
          phone: input.contact.phone.trim(),
        },
        passenger: {
          fullName: input.passenger.fullName.trim(),
          documentNumber: input.passenger.documentNumber.trim(),
          birthDate: normalizeOptionalText(input.passenger.birthDate),
          nationality: normalizeOptionalText(input.passenger.nationality),
          specialRequirements: normalizeOptionalText(
            input.passenger.specialRequirements,
          ),
        },
      }

      if (!user) {
        throw new CheckoutAuthenticationException()
      }

      if (normalizedInput.items.length === 0) {
        throw new CheckoutValidationException("Cart is empty")
      }

      assertCheckoutPaymentConfigured(normalizedInput.paymentMethod)

      const orderReference = buildOrderReference()
      const paymentMethod = mapCheckoutPaymentMethod(normalizedInput.paymentMethod)
      const order = await this.ordenesService.create({
        usuario_id: user.id,
        codigo_referencia: orderReference,
        estado: "pendiente",
        estado_pago: "pending",
        metodo_pago: paymentMethod,
        total: normalizedInput.items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0,
        ),
        moneda: normalizedInput.items[0]?.moneda ?? "ARS",
        contacto: {
          firstName: normalizedInput.contact.firstName,
          lastName: normalizedInput.contact.lastName ?? null,
          email: normalizedInput.contact.email,
          phone: normalizedInput.contact.phone,
        },
        pasajero_principal: {
          fullName: normalizedInput.passenger.fullName,
          documentNumber: normalizedInput.passenger.documentNumber,
          birthDate: normalizedInput.passenger.birthDate ?? null,
          nationality: normalizedInput.passenger.nationality ?? null,
          specialRequirements:
            normalizedInput.passenger.specialRequirements ?? null,
        },
        notas: `Checkout iniciado ${new Date().toISOString()}`,
      })

      const reservations = []

      for (const item of normalizedInput.items) {
        const reservation = await this.createReservationForItem(
          item,
          normalizedInput,
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

      const successUrl = `/checkout/success?orderId=${order.id}&paymentMethod=${normalizedInput.paymentMethod}`
      const errorUrl = `/checkout/error?orderId=${order.id}&paymentMethod=${normalizedInput.paymentMethod}`
      const transferUrl = `/checkout/transferencia?orderId=${order.id}&paymentMethod=${normalizedInput.paymentMethod}`
      await this.syncSavedProfile(normalizedInput, user)

      if (normalizedInput.paymentMethod === "mercadopago") {
        const payment = await this.paymentsService.createMercadoPagoCheckoutPro({
          orderId: order.id,
          payer: buildPaymentPayer(normalizedInput),
          successPath: successUrl,
          failurePath: errorUrl,
          pendingPath: successUrl,
        })
        const orderDetail = await this.paymentsService.getCheckoutOrderSummary(
          order.id,
        )
        await this.notifyOrderCreated(order.id)

        return {
          paymentMethod: normalizedInput.paymentMethod,
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

      if (normalizedInput.paymentMethod === "transferencia") {
        const bankTransfer = await this.paymentsService.createBankTransfer({
          orderId: order.id,
          payer: buildPaymentPayer(normalizedInput),
          note: `Checkout web ${new Date().toISOString()}`,
        })
        const orderDetail = await this.paymentsService.getCheckoutOrderSummary(
          order.id,
        )
        await this.notifyOrderCreated(order.id)

        return {
          paymentMethod: normalizedInput.paymentMethod,
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

      throw new CheckoutValidationException("Unsupported checkout payment method")
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

  async getSavedProfile(
    user: CheckoutUserContext | null,
  ): Promise<CheckoutProfileResult | null> {
    try {
      if (!user) {
        throw new CheckoutAuthenticationException()
      }

      const profile = await this.checkoutProfilesService.getByUsuarioId(user.id)

      if (!profile) {
        return null
      }

      return {
        contact: {
          firstName: profile.contact_first_name ?? "",
          lastName: profile.contact_last_name ?? "",
          email: profile.contact_email ?? "",
          phone: profile.contact_phone ?? "",
        },
        passenger: {
          fullName: profile.passenger_full_name ?? "",
          documentNumber: profile.passenger_document_number ?? "",
          birthDate: profile.passenger_birth_date ?? "",
          nationality: profile.passenger_nationality ?? "",
          specialRequirements: profile.passenger_special_requirements ?? "",
        },
      }
    } catch (error) {
      if (error instanceof CheckoutAuthenticationException) {
        throw error
      }

      throw new CheckoutServiceException("getSavedProfile", error)
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
