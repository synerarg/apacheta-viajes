import {
  HotelesImagenesNotFoundException,
  HotelesImagenesServiceException,
} from "@/exceptions/hoteles-imagenes/hoteles-imagenes.exceptions"
import { HotelesImagenesRepository } from "@/repositories/hoteles-imagenes/hoteles-imagenes.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  HotelesImagenesRow,
  HotelesImagenesUpdate,
} from "@/types/hoteles-imagenes/hoteles-imagenes.types"

export class HotelesImagenesService extends BaseService<"hoteles_imagenes"> {
  constructor(repository: HotelesImagenesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new HotelesImagenesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new HotelesImagenesNotFoundException(criteria)
  }

  async getById(id: string): Promise<HotelesImagenesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: HotelesImagenesUpdate,
  ): Promise<HotelesImagenesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createHotelesImagenesService(
  repository: HotelesImagenesRepository,
) {
  return new HotelesImagenesService(repository)
}
