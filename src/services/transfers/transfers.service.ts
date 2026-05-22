import {
  TransfersNotFoundException,
  TransfersServiceException,
} from "@/exceptions/transfers/transfers.exceptions"
import { TransfersRepository } from "@/repositories/transfers/transfers.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  TransfersRow,
  TransfersUpdate,
} from "@/types/transfers/transfers.types"

export class TransfersService extends BaseService<"traslados"> {
  constructor(repository: TransfersRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new TransfersServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new TransfersNotFoundException(criteria)
  }

  async getById(id: string): Promise<TransfersRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: TransfersUpdate,
  ): Promise<TransfersRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createTransfersService(repository: TransfersRepository) {
  return new TransfersService(repository)
}
