import {
  TrasladosTarifasNotFoundException,
  TrasladosTarifasServiceException,
} from "@/exceptions/traslados-tarifas/traslados-tarifas.exceptions"
import { TrasladosTarifasRepository } from "@/repositories/traslados-tarifas/traslados-tarifas.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  TrasladosTarifasRow,
  TrasladosTarifasUpdate,
} from "@/types/traslados-tarifas/traslados-tarifas.types"

export class TrasladosTarifasService extends BaseService<"traslados_tarifas"> {
  constructor(repository: TrasladosTarifasRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new TrasladosTarifasServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new TrasladosTarifasNotFoundException(criteria)
  }

  async getById(id: string): Promise<TrasladosTarifasRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: TrasladosTarifasUpdate,
  ): Promise<TrasladosTarifasRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createTrasladosTarifasService(
  repository: TrasladosTarifasRepository,
) {
  return new TrasladosTarifasService(repository)
}
