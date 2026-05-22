import {
  OrderPaymentNotFoundException,
  PaymentRecordNotFoundException,
  PaymentProcessingRepositoryException,
  ReservationPaymentNotFoundException,
} from "@/exceptions/payment-processing/payment-processing.exceptions"
import { getBankTransferConfig } from "@/lib/payments/payments.config"
import { createOrderItemsRepository } from "@/repositories/order-items/order-items.repository"
import { createOrdersRepository } from "@/repositories/orders/orders.repository"
import { createPaymentEventsRepository } from "@/repositories/payment-events/payment-events.repository"
import { createPaymentsRepository } from "@/repositories/payments/payments.repository"
import { createReservationsRepository } from "@/repositories/reservations/reservations.repository"
import { createUsersRepository } from "@/repositories/users/users.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OrdersUpdate } from "@/types/orders/orders.types"
import type {
  OrderPaymentContext,
  ReservationPaymentContext,
} from "@/types/payment-processing/payment-processing.types"
import type { PaymentEventsInsert } from "@/types/payment-events/payment-events.types"
import type { PaymentsInsert, PaymentsRow, PaymentsUpdate } from "@/types/payments/payments.types"
import type { ReservationStatus } from "@/types/reservations/reservations.types"

function mergeReservationNotes(currentNotes: string | null, nextNote: string) {
  return [currentNotes?.trim(), nextNote.trim()].filter(Boolean).join("\n\n")
}

function sanitizeReceiptFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
}

function buildReceiptStoragePath(
  orderId: string,
  paymentId: string,
  fileName: string,
) {
  return `${orderId}/${paymentId}/${Date.now()}-${sanitizeReceiptFileName(fileName)}`
}

function resolveLatestPayment(payments: PaymentsRow[]) {
  return [...payments].sort((left, right) => {
    const leftDate = left.created_at ? Date.parse(left.created_at) : 0
    const rightDate = right.created_at ? Date.parse(right.created_at) : 0

    return rightDate - leftDate
  })[0] ?? null
}

function sortByNewest<TRecord extends { created_at: string | null }>(
  records: TRecord[],
) {
  return [...records].sort((left, right) => {
    const leftDate = left.created_at ? Date.parse(left.created_at) : 0
    const rightDate = right.created_at ? Date.parse(right.created_at) : 0

    return rightDate - leftDate
  })
}

async function resolveReceiptSignedUrl(
  supabase: DatabaseClient,
  storagePath: string,
) {
  const config = getBankTransferConfig()
  const signedUrl = await supabase.storage
    .from(config.receiptBucket)
    .createSignedUrl(storagePath, config.receiptSignedUrlTtlSeconds)

  if (signedUrl.error) {
    throw signedUrl.error
  }

  if (!signedUrl.data?.signedUrl) {
    throw new Error("No se pudo generar el acceso al comprobante.")
  }

  return signedUrl.data.signedUrl
}

export class PaymentProcessingRepository {
  private readonly reservationsRepository
  private readonly usersRepository
  private readonly ordersRepository
  private readonly ordersItemsRepository
  private readonly paymentsRepository
  private readonly paymentsEventosRepository

  constructor(private readonly supabase: DatabaseClient) {
    this.reservationsRepository = createReservationsRepository(supabase)
    this.usersRepository = createUsersRepository(supabase)
    this.ordersRepository = createOrdersRepository(supabase)
    this.ordersItemsRepository = createOrderItemsRepository(supabase)
    this.paymentsRepository = createPaymentsRepository(supabase)
    this.paymentsEventosRepository = createPaymentEventsRepository(supabase)
  }

  async getReservationContext(
    reservationId: string,
  ): Promise<ReservationPaymentContext> {
    try {
      const reservation = await this.reservationsRepository.findById(reservationId)

      if (!reservation) {
        throw new ReservationPaymentNotFoundException(
          `reservationId ${reservationId}`,
        )
      }

      const user = await this.usersRepository.findById(reservation.usuario_id)

      return {
        reservation,
        user,
      }
    } catch (error) {
      if (error instanceof ReservationPaymentNotFoundException) {
        throw error
      }

      throw new PaymentProcessingRepositoryException("getReservationContext", error)
    }
  }

  async getPaymentById(paymentId: string) {
    try {
      const payment = await this.paymentsRepository.findById(paymentId)

      if (!payment) {
        throw new PaymentRecordNotFoundException(`paymentId ${paymentId}`)
      }

      return payment
    } catch (error) {
      if (error instanceof PaymentRecordNotFoundException) {
        throw error
      }

      throw new PaymentProcessingRepositoryException("getPaymentById", error)
    }
  }

  async getPaymentByExternalReference(externalReference: string) {
    try {
      const payment =
        await this.paymentsRepository.findByExternalReference(externalReference)

      if (!payment) {
        throw new PaymentRecordNotFoundException(
          `external_reference ${externalReference}`,
        )
      }

      return payment
    } catch (error) {
      if (error instanceof PaymentRecordNotFoundException) {
        throw error
      }

      throw new PaymentProcessingRepositoryException(
        "getPaymentByExternalReference",
        error,
      )
    }
  }

  async listExpiredOpenBankTransfers(referenceDate: string) {
    try {
      return await this.paymentsRepository.listExpiredOpenBankTransfers(
        referenceDate,
      )
    } catch (error) {
      throw new PaymentProcessingRepositoryException(
        "listExpiredOpenBankTransfers",
        error,
      )
    }
  }

  async getOrderContext(orderId: string): Promise<OrderPaymentContext> {
    try {
      const order = await this.ordersRepository.findById(orderId)

      if (!order) {
        throw new OrderPaymentNotFoundException(`orderId ${orderId}`)
      }

      const [items, payments, user] = await Promise.all([
        this.ordersItemsRepository.listByOrderId(order.id),
        this.paymentsRepository.listByOrderId(order.id),
        this.usersRepository.findById(order.usuario_id),
      ])

      const reservations = (
        await Promise.all(
          items.map((item) => this.reservationsRepository.findById(item.reserva_id)),
        )
      ).filter((reservation) => reservation !== null)

      return {
        order,
        items,
        reservations,
        user,
        latestPayment: resolveLatestPayment(payments),
      }
    } catch (error) {
      if (error instanceof OrderPaymentNotFoundException) {
        throw error
      }

      throw new PaymentProcessingRepositoryException("getOrderContext", error)
    }
  }

  async createPayment(payload: PaymentsInsert) {
    try {
      return await this.paymentsRepository.create(payload)
    } catch (error) {
      throw new PaymentProcessingRepositoryException("createPayment", error)
    }
  }

  async updatePaymentById(paymentId: string, payload: PaymentsUpdate) {
    try {
      const payment = await this.paymentsRepository.updateById(paymentId, payload)

      if (!payment) {
        throw new PaymentRecordNotFoundException(`paymentId ${paymentId}`)
      }

      return payment
    } catch (error) {
      if (error instanceof PaymentRecordNotFoundException) {
        throw error
      }

      throw new PaymentProcessingRepositoryException("updatePaymentById", error)
    }
  }

  async createPaymentEvent(payload: PaymentEventsInsert) {
    try {
      return await this.paymentsEventosRepository.create(payload)
    } catch (error) {
      throw new PaymentProcessingRepositoryException("createPaymentEvent", error)
    }
  }

  async listPaymentEvents(paymentId: string) {
    try {
      return await this.paymentsEventosRepository.listByPaymentId(paymentId)
    } catch (error) {
      throw new PaymentProcessingRepositoryException("listPaymentEvents", error)
    }
  }

  async updateOrderById(
    orderId: string,
    payload: OrdersUpdate,
  ) {
    try {
      const order = await this.ordersRepository.updateById(orderId, payload)

      if (!order) {
        throw new OrderPaymentNotFoundException(`orderId ${orderId}`)
      }

      return order
    } catch (error) {
      if (error instanceof OrderPaymentNotFoundException) {
        throw error
      }

      throw new PaymentProcessingRepositoryException("updateOrderById", error)
    }
  }

  async appendReservationNote(reservationId: string, note: string) {
    try {
      const { reservation } = await this.getReservationContext(reservationId)

      return await this.reservationsRepository.updateById(reservationId, {
        notas: mergeReservationNotes(reservation.notas, note),
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      throw new PaymentProcessingRepositoryException("appendReservationNote", error)
    }
  }

  async updateReservationStatus(
    reservationId: string,
    estado: ReservationStatus,
    note?: string,
  ) {
    try {
      const { reservation } = await this.getReservationContext(reservationId)

      return await this.reservationsRepository.updateById(reservationId, {
        estado,
        notas: note
          ? mergeReservationNotes(reservation.notas, note)
          : reservation.notas,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      throw new PaymentProcessingRepositoryException("updateReservationStatus", error)
    }
  }

  async updateOrderReservationsStatus(
    orderId: string,
    estado: ReservationStatus,
    note: string,
  ) {
    try {
      const { reservations } = await this.getOrderContext(orderId)

      await Promise.all(
        reservations.map((reservation) =>
          this.reservationsRepository.updateById(reservation.id, {
            estado,
            notas: mergeReservationNotes(reservation.notas, note),
            updated_at: new Date().toISOString(),
          }),
        ),
      )
    } catch (error) {
      throw new PaymentProcessingRepositoryException(
        "updateOrderReservationsStatus",
        error,
      )
    }
  }

  async uploadBankTransferReceipt(input: {
    paymentId: string
    fileName: string
    fileType: string
    fileBuffer: ArrayBuffer
  }) {
    try {
      const payment = await this.getPaymentById(input.paymentId)
      const config = getBankTransferConfig()
      const storagePath = buildReceiptStoragePath(
        payment.orden_id,
        payment.id,
        input.fileName,
      )
      const buffer = Buffer.from(input.fileBuffer)
      const upload = await this.supabase.storage
        .from(config.receiptBucket)
        .upload(storagePath, buffer, {
          contentType: input.fileType,
          upsert: true,
        })

      if (upload.error) {
        throw upload.error
      }

      return {
        receiptStoragePath: storagePath,
      }
    } catch (error) {
      throw new PaymentProcessingRepositoryException("uploadBankTransferReceipt", error)
    }
  }

  async createBankTransferReceiptSignedUploadUrl(input: {
    paymentId: string
    fileName: string
  }) {
    try {
      const payment = await this.getPaymentById(input.paymentId)
      const config = getBankTransferConfig()
      const storagePath = buildReceiptStoragePath(
        payment.orden_id,
        payment.id,
        input.fileName,
      )
      const signedUpload = await this.supabase.storage
        .from(config.receiptBucket)
        .createSignedUploadUrl(storagePath)

      if (signedUpload.error) {
        throw signedUpload.error
      }

      if (!signedUpload.data?.token) {
        throw new Error("No se pudo preparar la carga del comprobante.")
      }

      return {
        bucket: config.receiptBucket,
        path: storagePath,
        token: signedUpload.data.token,
      }
    } catch (error) {
      throw new PaymentProcessingRepositoryException(
        "createBankTransferReceiptSignedUploadUrl",
        error,
      )
    }
  }

  async assertReceiptObjectExists(storagePath: string) {
    try {
      const config = getBankTransferConfig()
      const objectInfo = await this.supabase.storage
        .from(config.receiptBucket)
        .info(storagePath)

      if (objectInfo.error) {
        throw objectInfo.error
      }

      if (!objectInfo.data) {
        throw new Error("No se pudo validar el comprobante cargado.")
      }
    } catch (error) {
      throw new PaymentProcessingRepositoryException("assertReceiptObjectExists", error)
    }
  }

  async listUserOrderContexts(userId: string): Promise<OrderPaymentContext[]> {
    try {
      const [orders, user] = await Promise.all([
        this.ordersRepository.listByUserId(userId),
        this.usersRepository.findById(userId),
      ])

      return Promise.all(
        sortByNewest(orders).map(async (order) => {
          const [items, payments] = await Promise.all([
            this.ordersItemsRepository.listByOrderId(order.id),
            this.paymentsRepository.listByOrderId(order.id),
          ])
          const reservations = (
            await Promise.all(
              items.map((item) =>
                this.reservationsRepository.findById(item.reserva_id),
              ),
            )
          ).filter((reservation) => reservation !== null)

          return {
            order,
            items,
            reservations,
            user,
            latestPayment: resolveLatestPayment(payments),
          }
        }),
      )
    } catch (error) {
      throw new PaymentProcessingRepositoryException("listUserOrderContexts", error)
    }
  }

  async getUserProfile(userId: string) {
    try {
      return await this.usersRepository.findById(userId)
    } catch (error) {
      throw new PaymentProcessingRepositoryException("getUserProfile", error)
    }
  }

  async createReceiptSignedUrl(storagePath: string) {
    try {
      return await resolveReceiptSignedUrl(this.supabase, storagePath)
    } catch (error) {
      throw new PaymentProcessingRepositoryException("createReceiptSignedUrl", error)
    }
  }
}

export function createPaymentProcessingRepository(supabase: DatabaseClient) {
  return new PaymentProcessingRepository(supabase)
}
