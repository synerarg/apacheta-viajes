import {
  PaquetesImagenesNotFoundException,
  PaquetesImagenesServiceException,
} from "@/exceptions/paquetes-imagenes/paquetes-imagenes.exceptions"
import { PaquetesImagenesRepository } from "@/repositories/paquetes-imagenes/paquetes-imagenes.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PaquetesImagenesRow,
  PaquetesImagenesUpdate,
} from "@/types/paquetes-imagenes/paquetes-imagenes.types"

export class PaquetesImagenesService extends BaseService<"paquetes_imagenes"> {
  constructor(repository: PaquetesImagenesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PaquetesImagenesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PaquetesImagenesNotFoundException(criteria)
  }

  async getById(id: string): Promise<PaquetesImagenesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: PaquetesImagenesUpdate,
  ): Promise<PaquetesImagenesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createPaquetesImagenesService(
  repository: PaquetesImagenesRepository,
) {
  return new PaquetesImagenesService(repository)
}
