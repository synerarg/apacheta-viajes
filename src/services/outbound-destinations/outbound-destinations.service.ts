import {
  OutboundDestinationsNotFoundException,
  OutboundDestinationsServiceException,
} from "@/exceptions/outbound-destinations/outbound-destinations.exceptions"
import { OutboundDestinationsRepository } from "@/repositories/outbound-destinations/outbound-destinations.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  OutboundDestinationsRow,
  OutboundDestinationsUpdate,
} from "@/types/outbound-destinations/outbound-destinations.types"

export class OutboundDestinationsService extends BaseService<"emisivo_destinos"> {
  constructor(repository: OutboundDestinationsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OutboundDestinationsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OutboundDestinationsNotFoundException(criteria)
  }

  async getById(id: string): Promise<OutboundDestinationsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: OutboundDestinationsUpdate,
  ): Promise<OutboundDestinationsRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createOutboundDestinationsService(
  repository: OutboundDestinationsRepository,
) {
  return new OutboundDestinationsService(repository)
}
