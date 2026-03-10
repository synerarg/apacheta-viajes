import {
  EmisivoImagenesNotFoundException,
  EmisivoImagenesServiceException,
} from "@/exceptions/emisivo-imagenes/emisivo-imagenes.exceptions"
import { EmisivoImagenesRepository } from "@/repositories/emisivo-imagenes/emisivo-imagenes.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  EmisivoImagenesRow,
  EmisivoImagenesUpdate,
} from "@/types/emisivo-imagenes/emisivo-imagenes.types"

export class EmisivoImagenesService extends BaseService<"emisivo_imagenes"> {
  constructor(repository: EmisivoImagenesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new EmisivoImagenesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new EmisivoImagenesNotFoundException(criteria)
  }

  async getById(id: string): Promise<EmisivoImagenesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: EmisivoImagenesUpdate,
  ): Promise<EmisivoImagenesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createEmisivoImagenesService(
  repository: EmisivoImagenesRepository,
) {
  return new EmisivoImagenesService(repository)
}
