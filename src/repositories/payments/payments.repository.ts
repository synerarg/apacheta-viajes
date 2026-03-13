import {
  PaymentsRepositoryException,
  ReservationPaymentNotFoundException,
} from "@/exceptions/payments/payments.exceptions"
import { createReservasRepository } from "@/repositories/reservas/reservas.repository"
import { createUsuariosRepository } from "@/repositories/usuarios/usuarios.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { ReservationPaymentContext } from "@/types/payments/payments.types"
import type { ReservaEstado } from "@/types/reservas/reservas.types"

function mergeReservationNotes(currentNotes: string | null, nextNote: string) {
  return [currentNotes?.trim(), nextNote.trim()].filter(Boolean).join("\n\n")
}

export class PaymentsRepository {
  private readonly reservasRepository
  private readonly usuariosRepository

  constructor(private readonly supabase: DatabaseClient) {
    this.reservasRepository = createReservasRepository(supabase)
    this.usuariosRepository = createUsuariosRepository(supabase)
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
}

export function createPaymentsRepository(supabase: DatabaseClient) {
  return new PaymentsRepository(supabase)
}
