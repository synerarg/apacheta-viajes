import {
  OrderPaymentNotFoundException,
  PaymentRecordNotFoundException,
  PaymentsRepositoryException,
  ReservationPaymentNotFoundException,
} from "@/exceptions/payments/payments.exceptions"
import { getBankTransferConfig } from "@/lib/payments/payments.config"
import { createOrdenesItemsRepository } from "@/repositories/ordenes-items/ordenes-items.repository"
import { createOrdenesRepository } from "@/repositories/ordenes/ordenes.repository"
import { createPagosEventosRepository } from "@/repositories/pagos-eventos/pagos-eventos.repository"
import { createPagosRepository } from "@/repositories/pagos/pagos.repository"
import { createReservasRepository } from "@/repositories/reservas/reservas.repository"
import { createUsuariosRepository } from "@/repositories/usuarios/usuarios.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OrdenesUpdate } from "@/types/ordenes/ordenes.types"
import type {
  OrderPaymentContext,
  ReservationPaymentContext,
} from "@/types/payments/payments.types"
import type { PagosEventosInsert } from "@/types/pagos-eventos/pagos-eventos.types"
import type { PagosInsert, PagosRow, PagosUpdate } from "@/types/pagos/pagos.types"
import type { ReservaEstado } from "@/types/reservas/reservas.types"

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

function resolveLatestPayment(payments: PagosRow[]) {
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
    throw new Error("Supabase did not return a signed receipt URL")
  }

  return signedUrl.data.signedUrl
}

export class PaymentsRepository {
  private readonly reservasRepository
  private readonly usuariosRepository
  private readonly ordenesRepository
  private readonly ordenesItemsRepository
  private readonly pagosRepository
  private readonly pagosEventosRepository

  constructor(private readonly supabase: DatabaseClient) {
    this.reservasRepository = createReservasRepository(supabase)
    this.usuariosRepository = createUsuariosRepository(supabase)
    this.ordenesRepository = createOrdenesRepository(supabase)
    this.ordenesItemsRepository = createOrdenesItemsRepository(supabase)
    this.pagosRepository = createPagosRepository(supabase)
    this.pagosEventosRepository = createPagosEventosRepository(supabase)
  }

  async getReservationContext(
    reservationId: string,
  ): Promise<ReservationPaymentContext> {
    try {
      const reservation = await this.reservasRepository.findById(reservationId)

      if (!reservation) {
        throw new ReservationPaymentNotFoundException(
          `reservationId ${reservationId}`,
        )
      }

      const user = await this.usuariosRepository.findById(reservation.usuario_id)

      return {
        reservation,
        user,
      }
    } catch (error) {
      if (error instanceof ReservationPaymentNotFoundException) {
        throw error
      }

      throw new PaymentsRepositoryException("getReservationContext", error)
    }
  }

  async getPaymentById(paymentId: string) {
    try {
      const payment = await this.pagosRepository.findById(paymentId)

      if (!payment) {
        throw new PaymentRecordNotFoundException(`paymentId ${paymentId}`)
      }

      return payment
    } catch (error) {
      if (error instanceof PaymentRecordNotFoundException) {
        throw error
      }

      throw new PaymentsRepositoryException("getPaymentById", error)
    }
  }

  async getPaymentByExternalReference(externalReference: string) {
    try {
      const payment =
        await this.pagosRepository.findByExternalReference(externalReference)

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

      throw new PaymentsRepositoryException(
        "getPaymentByExternalReference",
        error,
      )
    }
  }

  async getOrderContext(orderId: string): Promise<OrderPaymentContext> {
    try {
      const order = await this.ordenesRepository.findById(orderId)

      if (!order) {
        throw new OrderPaymentNotFoundException(`orderId ${orderId}`)
      }

      const [items, payments, user] = await Promise.all([
        this.ordenesItemsRepository.listByOrdenId(order.id),
        this.pagosRepository.listByOrdenId(order.id),
        this.usuariosRepository.findById(order.usuario_id),
      ])

      const reservations = (
        await Promise.all(
          items.map((item) => this.reservasRepository.findById(item.reserva_id)),
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

      throw new PaymentsRepositoryException("getOrderContext", error)
    }
  }

  async createPayment(payload: PagosInsert) {
    try {
      return await this.pagosRepository.create(payload)
    } catch (error) {
      throw new PaymentsRepositoryException("createPayment", error)
    }
  }

  async updatePaymentById(paymentId: string, payload: PagosUpdate) {
    try {
      const payment = await this.pagosRepository.updateById(paymentId, payload)

      if (!payment) {
        throw new PaymentRecordNotFoundException(`paymentId ${paymentId}`)
      }

      return payment
    } catch (error) {
      if (error instanceof PaymentRecordNotFoundException) {
        throw error
      }

      throw new PaymentsRepositoryException("updatePaymentById", error)
    }
  }

  async createPaymentEvent(payload: PagosEventosInsert) {
    try {
      return await this.pagosEventosRepository.create(payload)
    } catch (error) {
      throw new PaymentsRepositoryException("createPaymentEvent", error)
    }
  }

  async listPaymentEvents(paymentId: string) {
    try {
      return await this.pagosEventosRepository.listByPagoId(paymentId)
    } catch (error) {
      throw new PaymentsRepositoryException("listPaymentEvents", error)
    }
  }

  async updateOrderById(
    orderId: string,
    payload: OrdenesUpdate,
  ) {
    try {
      const order = await this.ordenesRepository.updateById(orderId, payload)

      if (!order) {
        throw new OrderPaymentNotFoundException(`orderId ${orderId}`)
      }

      return order
    } catch (error) {
      if (error instanceof OrderPaymentNotFoundException) {
        throw error
      }

      throw new PaymentsRepositoryException("updateOrderById", error)
    }
  }

  async appendReservationNote(reservationId: string, note: string) {
    try {
      const { reservation } = await this.getReservationContext(reservationId)

      return await this.reservasRepository.updateById(reservationId, {
        notas: mergeReservationNotes(reservation.notas, note),
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      throw new PaymentsRepositoryException("appendReservationNote", error)
    }
  }

  async updateReservationStatus(
    reservationId: string,
    estado: ReservaEstado,
    note?: string,
  ) {
    try {
      const { reservation } = await this.getReservationContext(reservationId)

      return await this.reservasRepository.updateById(reservationId, {
        estado,
        notas: note
          ? mergeReservationNotes(reservation.notas, note)
          : reservation.notas,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      throw new PaymentsRepositoryException("updateReservationStatus", error)
    }
  }

  async updateOrderReservationsStatus(
    orderId: string,
    estado: ReservaEstado,
    note: string,
  ) {
    try {
      const { reservations } = await this.getOrderContext(orderId)

      await Promise.all(
        reservations.map((reservation) =>
          this.reservasRepository.updateById(reservation.id, {
            estado,
            notas: mergeReservationNotes(reservation.notas, note),
            updated_at: new Date().toISOString(),
          }),
        ),
      )
    } catch (error) {
      throw new PaymentsRepositoryException(
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
      throw new PaymentsRepositoryException("uploadBankTransferReceipt", error)
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
        throw new Error("Supabase did not return a signed upload token")
      }

      return {
        bucket: config.receiptBucket,
        path: storagePath,
        token: signedUpload.data.token,
      }
    } catch (error) {
      throw new PaymentsRepositoryException(
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
        throw new Error("Supabase did not return the uploaded receipt object")
      }
    } catch (error) {
      throw new PaymentsRepositoryException("assertReceiptObjectExists", error)
    }
  }

  async listUserOrderContexts(userId: string): Promise<OrderPaymentContext[]> {
    try {
      const [orders, user] = await Promise.all([
        this.ordenesRepository.listByUsuarioId(userId),
        this.usuariosRepository.findById(userId),
      ])

      return Promise.all(
        sortByNewest(orders).map(async (order) => {
          const [items, payments] = await Promise.all([
            this.ordenesItemsRepository.listByOrdenId(order.id),
            this.pagosRepository.listByOrdenId(order.id),
          ])
          const reservations = (
            await Promise.all(
              items.map((item) =>
                this.reservasRepository.findById(item.reserva_id),
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
      throw new PaymentsRepositoryException("listUserOrderContexts", error)
    }
  }

  async getUserProfile(userId: string) {
    try {
      return await this.usuariosRepository.findById(userId)
    } catch (error) {
      throw new PaymentsRepositoryException("getUserProfile", error)
    }
  }

  async createReceiptSignedUrl(storagePath: string) {
    try {
      return await resolveReceiptSignedUrl(this.supabase, storagePath)
    } catch (error) {
      throw new PaymentsRepositoryException("createReceiptSignedUrl", error)
    }
  }
}

export function createPaymentsRepository(supabase: DatabaseClient) {
  return new PaymentsRepository(supabase)
}
