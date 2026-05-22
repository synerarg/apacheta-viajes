import {
  HotelsNotFoundException,
  HotelsServiceException,
} from "@/exceptions/hotels/hotels.exceptions"
import { HotelsRepository } from "@/repositories/hotels/hotels.repository"
import { BaseService } from "@/services/base/base.service"
import type { HotelsRow, HotelsUpdate } from "@/types/hotels/hotels.types"

export class HotelsService extends BaseService<"hoteles"> {
  constructor(repository: HotelsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new HotelsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new HotelsNotFoundException(criteria)
  }

  async getById(id: string): Promise<HotelsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: HotelsUpdate): Promise<HotelsRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createHotelsService(repository: HotelsRepository) {
  return new HotelsService(repository)
}
