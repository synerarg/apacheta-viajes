import {
  DestinosNotFoundException,
  DestinosServiceException,
} from "@/exceptions/destinos/destinos.exceptions"
import { DestinosRepository } from "@/repositories/destinos/destinos.repository"
import { BaseService } from "@/services/base/base.service"
import type { DestinosRow, DestinosUpdate } from "@/types/destinos/destinos.types"

export class DestinosService extends BaseService<"destinos"> {
  constructor(repository: DestinosRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new DestinosServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new DestinosNotFoundException(criteria)
  }

  async getById(id: string): Promise<DestinosRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: DestinosUpdate): Promise<DestinosRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createDestinosService(repository: DestinosRepository) {
  return new DestinosService(repository)
}
