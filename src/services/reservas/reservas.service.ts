import {
  ReservasNotFoundException,
  ReservasServiceException,
} from "@/exceptions/reservas/reservas.exceptions"
import { ReservasRepository } from "@/repositories/reservas/reservas.repository"
import { BaseService } from "@/services/base/base.service"
import type { ReservasRow, ReservasUpdate } from "@/types/reservas/reservas.types"

export class ReservasService extends BaseService<"reservas"> {
  constructor(repository: ReservasRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new ReservasServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new ReservasNotFoundException(criteria)
  }

  async getById(id: string): Promise<ReservasRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: ReservasUpdate): Promise<ReservasRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createReservasService(repository: ReservasRepository) {
  return new ReservasService(repository)
}
