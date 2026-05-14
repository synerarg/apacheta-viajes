import {
  TrasladosImagenesNotFoundException,
  TrasladosImagenesServiceException,
} from "@/exceptions/traslados-imagenes/traslados-imagenes.exceptions"
import { TrasladosImagenesRepository } from "@/repositories/traslados-imagenes/traslados-imagenes.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  TrasladosImagenesRow,
  TrasladosImagenesUpdate,
} from "@/types/traslados-imagenes/traslados-imagenes.types"

export class TrasladosImagenesService extends BaseService<"traslados_imagenes"> {
  constructor(repository: TrasladosImagenesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new TrasladosImagenesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new TrasladosImagenesNotFoundException(criteria)
  }

  async getById(id: string): Promise<TrasladosImagenesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: TrasladosImagenesUpdate,
  ): Promise<TrasladosImagenesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createTrasladosImagenesService(
  repository: TrasladosImagenesRepository,
) {
  return new TrasladosImagenesService(repository)
}
