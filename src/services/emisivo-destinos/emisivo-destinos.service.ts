import {
  EmisivoDestinosNotFoundException,
  EmisivoDestinosServiceException,
} from "@/exceptions/emisivo-destinos/emisivo-destinos.exceptions"
import { EmisivoDestinosRepository } from "@/repositories/emisivo-destinos/emisivo-destinos.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  EmisivoDestinosRow,
  EmisivoDestinosUpdate,
} from "@/types/emisivo-destinos/emisivo-destinos.types"

export class EmisivoDestinosService extends BaseService<"emisivo_destinos"> {
  constructor(repository: EmisivoDestinosRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new EmisivoDestinosServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new EmisivoDestinosNotFoundException(criteria)
  }

  async getById(id: string): Promise<EmisivoDestinosRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: EmisivoDestinosUpdate,
  ): Promise<EmisivoDestinosRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createEmisivoDestinosService(
  repository: EmisivoDestinosRepository,
) {
  return new EmisivoDestinosService(repository)
}
