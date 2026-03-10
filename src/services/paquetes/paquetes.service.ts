import {
  PaquetesNotFoundException,
  PaquetesServiceException,
} from "@/exceptions/paquetes/paquetes.exceptions"
import { PaquetesRepository } from "@/repositories/paquetes/paquetes.repository"
import { BaseService } from "@/services/base/base.service"
import type { PaquetesRow, PaquetesUpdate } from "@/types/paquetes/paquetes.types"

export class PaquetesService extends BaseService<"paquetes"> {
  constructor(repository: PaquetesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PaquetesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PaquetesNotFoundException(criteria)
  }

  async getById(id: string): Promise<PaquetesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: PaquetesUpdate): Promise<PaquetesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createPaquetesService(repository: PaquetesRepository) {
  return new PaquetesService(repository)
}
