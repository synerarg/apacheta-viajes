import {
  PaquetesFechasNotFoundException,
  PaquetesFechasServiceException,
} from "@/exceptions/paquetes-fechas/paquetes-fechas.exceptions"
import { PaquetesFechasRepository } from "@/repositories/paquetes-fechas/paquetes-fechas.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PaquetesFechasRow,
  PaquetesFechasUpdate,
} from "@/types/paquetes-fechas/paquetes-fechas.types"

export class PaquetesFechasService extends BaseService<"paquetes_fechas"> {
  constructor(repository: PaquetesFechasRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PaquetesFechasServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PaquetesFechasNotFoundException(criteria)
  }

  async getById(id: string): Promise<PaquetesFechasRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: PaquetesFechasUpdate,
  ): Promise<PaquetesFechasRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createPaquetesFechasService(
  repository: PaquetesFechasRepository,
) {
  return new PaquetesFechasService(repository)
}
