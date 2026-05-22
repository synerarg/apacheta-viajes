import {
  DestinationsNotFoundException,
  DestinationsServiceException,
} from "@/exceptions/destinations/destinations.exceptions"
import { DestinationsRepository } from "@/repositories/destinations/destinations.repository"
import { BaseService } from "@/services/base/base.service"
import type { DestinationsRow, DestinationsUpdate } from "@/types/destinations/destinations.types"

export class DestinationsService extends BaseService<"destinos"> {
  constructor(repository: DestinationsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new DestinationsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new DestinationsNotFoundException(criteria)
  }

  async getById(id: string): Promise<DestinationsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: DestinationsUpdate): Promise<DestinationsRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createDestinationsService(repository: DestinationsRepository) {
  return new DestinationsService(repository)
}
