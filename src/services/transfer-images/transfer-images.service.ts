import {
  TransferImagesNotFoundException,
  TransferImagesServiceException,
} from "@/exceptions/transfer-images/transfer-images.exceptions"
import { TransferImagesRepository } from "@/repositories/transfer-images/transfer-images.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  TransferImagesRow,
  TransferImagesUpdate,
} from "@/types/transfer-images/transfer-images.types"

export class TransferImagesService extends BaseService<"traslados_imagenes"> {
  constructor(repository: TransferImagesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new TransferImagesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new TransferImagesNotFoundException(criteria)
  }

  async getById(id: string): Promise<TransferImagesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: TransferImagesUpdate,
  ): Promise<TransferImagesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createTransferImagesService(
  repository: TransferImagesRepository,
) {
  return new TransferImagesService(repository)
}
