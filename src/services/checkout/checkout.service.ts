import {
  CheckoutAuthenticationException,
  CheckoutServiceException,
  CheckoutValidationException,
} from "@/exceptions/checkout/checkout.exceptions"
import {
  BankTransferConfigurationException,
  MercadoPagoConfigurationException,
} from "@/exceptions/payment-processing/payment-processing.exceptions"
import {
  getBankTransferConfig,
  getMercadoPagoConfig,
} from "@/lib/payments/payments.config"
import { createExperiencesRepository } from "@/repositories/experiences/experiences.repository"
import { createCheckoutProfilesRepository } from "@/repositories/checkout-profiles/checkout-profiles.repository"
import { createOrderItemsRepository } from "@/repositories/order-items/order-items.repository"
import { createOrdersRepository } from "@/repositories/orders/orders.repository"
import { createPackagesRepository } from "@/repositories/packages/packages.repository"
import { createPackageDatesRepository } from "@/repositories/package-dates/package-dates.repository"
import { createReservationsRepository } from "@/repositories/reservations/reservations.repository"
import { createExperiencesService } from "@/services/experiences/experiences.service"
import { createCheckoutProfilesService } from "@/services/checkout-profiles/checkout-profiles.service"
import { createOrderItemsService } from "@/services/order-items/order-items.service"
import { createOrdersService } from "@/services/orders/orders.service"
import { createPackagesService } from "@/services/packages/packages.service"
import { createPackageDatesService } from "@/services/package-dates/package-dates.service"
import { createPaymentProcessingService } from "@/services/payment-processing/payment-processing.service"
import { createReservationsService } from "@/services/reservations/reservations.service"
import { createTransactionalEmailService } from "@/services/notifications/transactional-email.service"
import type { CartItem } from "@/types/cart/cart.types"
import type {
  CheckoutProfileResult,
  CheckoutSubmitInput,
  CheckoutSubmitResult,
  CheckoutUserContext,
} from "@/types/checkout/checkout.types"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OrderPaymentMethod } from "@/types/orders/orders.types"
import type { ReservationsInsert } from "@/types/reservations/reservations.types"

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
    `Referencia de orden: ${orderReference}`,
    `Tipo de item: ${item.kind}`,
    `Item: ${item.name}`,
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
    input.travelDetails?.pickupAddress
      ? `Direccion de retiro o encuentro: ${input.travelDetails.pickupAddress}`
      : null,
    input.travelDetails?.flightNumber
      ? `Numero de vuelo: ${input.travelDetails.flightNumber}`
      : null,
    input.travelDetails?.airline
      ? `Linea aerea: ${input.travelDetails.airline}`
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

function includesTransferText(value: string) {
  return /traslad|transfer/i.test(value)
}

function checkoutRequiresPickupAddress(input: CheckoutSubmitInput) {
  return input.items.length > 0 && input.items.every((item) => item.kind === "experiencia")
}

function checkoutRequiresFlightDetails(input: CheckoutSubmitInput) {
  return input.items.some(
    (item) =>
      item.incluyeTraslado === true ||
      includesTransferText(item.category) ||
      includesTransferText(item.name),
  )
}

function buildPaymentPayer(input: CheckoutSubmitInput) {
  return {
    email: input.contact.email,
    fullName: input.passenger.fullName,
    documentNumber: input.passenger.documentNumber,
  }
}

function mapCheckoutPaymentMethod(method: CheckoutSubmitInput["paymentMethod"]): OrderPaymentMethod {
  if (method === "mercadopago") {
    return "mercadopago_checkout_pro"
  }

  if (method === "transferencia") {
    return "bank_transfer"
  }

  throw new CheckoutValidationException(
    "El medio de pago seleccionado no esta disponible.",
  )
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
  private readonly reservationsService
  private readonly packagesService
  private readonly packagesFechasService
  private readonly experiencesService
  private readonly ordersService
  private readonly ordersItemsService
  private readonly paymentsService
  private readonly transactionalEmailService

  constructor(supabase: DatabaseClient) {
    this.checkoutProfilesService = createCheckoutProfilesService(
      createCheckoutProfilesRepository(supabase),
    )
    this.reservationsService = createReservationsService(createReservationsRepository(supabase))
    this.packagesFechasService = createPackageDatesService(
      createPackageDatesRepository(supabase),
    )
    this.packagesService = createPackagesService(createPackagesRepository(supabase))
    this.experiencesService = createExperiencesService(
      createExperiencesRepository(supabase),
    )
    this.ordersService = createOrdersService(createOrdersRepository(supabase))
    this.ordersItemsService = createOrderItemsService(
      createOrderItemsRepository(supabase),
    )
    this.paymentsService = createPaymentProcessingService(supabase)
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
      await this.checkoutProfilesService.upsertByUserId(user.id, {
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

    await this.checkoutProfilesService.deleteByUserId(user.id)
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
        travelDetails: {
          pickupAddress: normalizeOptionalText(input.travelDetails?.pickupAddress),
          flightNumber: normalizeOptionalText(input.travelDetails?.flightNumber),
          airline: normalizeOptionalText(input.travelDetails?.airline),
        },
      }

      if (!user) {
        throw new CheckoutAuthenticationException()
      }

      if (normalizedInput.items.length === 0) {
        throw new CheckoutValidationException("Tu carrito esta vacio.")
      }

      if (
        checkoutRequiresPickupAddress(normalizedInput) &&
        !normalizedInput.travelDetails?.pickupAddress
      ) {
        throw new CheckoutValidationException(
          "Ingresa la direccion de retiro o encuentro para continuar.",
        )
      }

      if (
        checkoutRequiresFlightDetails(normalizedInput) &&
        !normalizedInput.travelDetails?.flightNumber
      ) {
        throw new CheckoutValidationException(
          "Ingresa el numero de vuelo para coordinar el traslado.",
        )
      }

      if (
        checkoutRequiresFlightDetails(normalizedInput) &&
        !normalizedInput.travelDetails?.airline
      ) {
        throw new CheckoutValidationException(
          "Ingresa la linea aerea para coordinar el traslado.",
        )
      }

      assertCheckoutPaymentConfigured(normalizedInput.paymentMethod)

      const orderReference = buildOrderReference()
      const paymentMethod = mapCheckoutPaymentMethod(normalizedInput.paymentMethod)
      const order = await this.ordersService.create({
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
          pickupAddress: normalizedInput.travelDetails?.pickupAddress ?? null,
          flightNumber: normalizedInput.travelDetails?.flightNumber ?? null,
          airline: normalizedInput.travelDetails?.airline ?? null,
        },
        notas: [
          `Checkout iniciado ${new Date().toISOString()}`,
          normalizedInput.travelDetails?.pickupAddress
            ? `Direccion de retiro o encuentro: ${normalizedInput.travelDetails.pickupAddress}`
            : null,
          normalizedInput.travelDetails?.flightNumber
            ? `Numero de vuelo: ${normalizedInput.travelDetails.flightNumber}`
            : null,
          normalizedInput.travelDetails?.airline
            ? `Linea aerea: ${normalizedInput.travelDetails.airline}`
            : null,
        ]
          .filter(Boolean)
          .join("\n"),
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

        await this.ordersItemsService.create({
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
            packageFechaId: item.packageFechaId,
            experienceId: item.experienceId,
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

      throw new CheckoutValidationException(
        "El medio de pago seleccionado no esta disponible.",
      )
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

      const order = await this.ordersService.getById(orderId)

      if (order.usuario_id !== user.id) {
        throw new CheckoutValidationException(
          "No encontramos la orden solicitada.",
        )
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

      const profile = await this.checkoutProfilesService.getByUserId(user.id)

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
    let reservationPayload: ReservationsInsert

    if (item.kind === "paquete") {
      if (!item.packageFechaId) {
        throw new CheckoutValidationException(
          "El paquete seleccionado no tiene una salida valida.",
        )
      }

      const packageFecha = await this.packagesFechasService.getById(
        item.packageFechaId,
      )
      const paquete = await this.packagesService.getById(packageFecha.paquete_id)

      if (packageFecha.activo === false) {
        throw new CheckoutValidationException(
          "La salida seleccionada ya no esta disponible.",
        )
      }

      if (item.quantity > packageFecha.cupo_disponible) {
        throw new CheckoutValidationException(
          "La cantidad de pasajeros supera la disponibilidad actual.",
        )
      }

      reservationPayload = {
        usuario_id: user.id,
        paquete_fecha_id: packageFecha.id,
        tipo: "paquete",
        estado: "pendiente",
        cantidad_pasajeros: item.quantity,
        precio_unitario: packageFecha.precio_por_persona,
        precio_total: packageFecha.precio_por_persona * item.quantity,
        moneda: packageFecha.moneda ?? item.moneda,
        notas: buildReservationNotes(
          {
            ...item,
            incluyeAlojamiento:
              item.incluyeAlojamiento ?? paquete.incluye_alojamiento ?? undefined,
            incluyeTraslado:
              item.incluyeTraslado ?? paquete.incluye_traslado ?? undefined,
          },
          input,
          user,
          orderReference,
        ),
      }
    } else {
      if (!item.experienceId) {
        throw new CheckoutValidationException(
          "La experiencia seleccionada no es valida.",
        )
      }

      const experiencia = await this.experiencesService.getById(item.experienceId)

      if (experiencia.activo === false) {
        throw new CheckoutValidationException(
          "La experiencia seleccionada ya no esta disponible.",
        )
      }

      if (!experiencia.precio) {
        throw new CheckoutValidationException(
          "La experiencia seleccionada no tiene un precio valido.",
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

    return this.reservationsService.create(reservationPayload)
  }
}

export function createCheckoutService(supabase: DatabaseClient) {
  return new CheckoutService(supabase)
}
