import {
  TransferRatesNotFoundException,
  TransferRatesServiceException,
} from "@/exceptions/transfer-rates/transfer-rates.exceptions"
import { TransferRatesRepository } from "@/repositories/transfer-rates/transfer-rates.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  TransferRatesRow,
  TransferRatesUpdate,
} from "@/types/transfer-rates/transfer-rates.types"

export class TransferRatesService extends BaseService<"traslados_tarifas"> {
  constructor(repository: TransferRatesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new TransferRatesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new TransferRatesNotFoundException(criteria)
  }

  async getById(id: string): Promise<TransferRatesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: TransferRatesUpdate,
  ): Promise<TransferRatesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createTransferRatesService(
  repository: TransferRatesRepository,
) {
  return new TransferRatesService(repository)
}
