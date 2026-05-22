import {
  ReservationsNotFoundException,
  ReservationsServiceException,
} from "@/exceptions/reservations/reservations.exceptions"
import { ReservationsRepository } from "@/repositories/reservations/reservations.repository"
import { BaseService } from "@/services/base/base.service"
import type { ReservationsRow, ReservationsUpdate } from "@/types/reservations/reservations.types"

export class ReservationsService extends BaseService<"reservas"> {
  constructor(repository: ReservationsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new ReservationsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new ReservationsNotFoundException(criteria)
  }

  async getById(id: string): Promise<ReservationsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: ReservationsUpdate): Promise<ReservationsRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createReservationsService(repository: ReservationsRepository) {
  return new ReservationsService(repository)
}
