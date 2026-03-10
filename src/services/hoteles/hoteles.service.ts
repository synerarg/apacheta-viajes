import {
  HotelesNotFoundException,
  HotelesServiceException,
} from "@/exceptions/hoteles/hoteles.exceptions"
import { HotelesRepository } from "@/repositories/hoteles/hoteles.repository"
import { BaseService } from "@/services/base/base.service"
import type { HotelesRow, HotelesUpdate } from "@/types/hoteles/hoteles.types"

export class HotelesService extends BaseService<"hoteles"> {
  constructor(repository: HotelesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new HotelesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new HotelesNotFoundException(criteria)
  }

  async getById(id: string): Promise<HotelesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: HotelesUpdate): Promise<HotelesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createHotelesService(repository: HotelesRepository) {
  return new HotelesService(repository)
}
