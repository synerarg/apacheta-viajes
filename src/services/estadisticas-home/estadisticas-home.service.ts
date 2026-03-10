import {
  EstadisticasHomeNotFoundException,
  EstadisticasHomeServiceException,
} from "@/exceptions/estadisticas-home/estadisticas-home.exceptions"
import { EstadisticasHomeRepository } from "@/repositories/estadisticas-home/estadisticas-home.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  EstadisticasHomeRow,
  EstadisticasHomeUpdate,
} from "@/types/estadisticas-home/estadisticas-home.types"

export class EstadisticasHomeService extends BaseService<"estadisticas_home"> {
  constructor(repository: EstadisticasHomeRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new EstadisticasHomeServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new EstadisticasHomeNotFoundException(criteria)
  }

  async getById(id: string): Promise<EstadisticasHomeRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: EstadisticasHomeUpdate,
  ): Promise<EstadisticasHomeRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createEstadisticasHomeService(
  repository: EstadisticasHomeRepository,
) {
  return new EstadisticasHomeService(repository)
}
