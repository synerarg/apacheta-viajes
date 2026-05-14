import {
  TrasladosNotFoundException,
  TrasladosServiceException,
} from "@/exceptions/traslados/traslados.exceptions"
import { TrasladosRepository } from "@/repositories/traslados/traslados.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  TrasladosRow,
  TrasladosUpdate,
} from "@/types/traslados/traslados.types"

export class TrasladosService extends BaseService<"traslados"> {
  constructor(repository: TrasladosRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new TrasladosServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new TrasladosNotFoundException(criteria)
  }

  async getById(id: string): Promise<TrasladosRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: TrasladosUpdate,
  ): Promise<TrasladosRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createTrasladosService(repository: TrasladosRepository) {
  return new TrasladosService(repository)
}
