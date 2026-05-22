import {
  OutboundImagesNotFoundException,
  OutboundImagesServiceException,
} from "@/exceptions/outbound-images/outbound-images.exceptions"
import { OutboundImagesRepository } from "@/repositories/outbound-images/outbound-images.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  OutboundImagesRow,
  OutboundImagesUpdate,
} from "@/types/outbound-images/outbound-images.types"

export class OutboundImagesService extends BaseService<"emisivo_imagenes"> {
  constructor(repository: OutboundImagesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OutboundImagesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OutboundImagesNotFoundException(criteria)
  }

  async getById(id: string): Promise<OutboundImagesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: OutboundImagesUpdate,
  ): Promise<OutboundImagesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createOutboundImagesService(
  repository: OutboundImagesRepository,
) {
  return new OutboundImagesService(repository)
}
