import { TransferRatesRepositoryException } from "@/exceptions/transfer-rates/transfer-rates.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { TransferRatesUpdate } from "@/types/transfer-rates/transfer-rates.types"

export class TransferRatesRepository extends BaseRepository<"traslados_tarifas"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "traslados_tarifas")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new TransferRatesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: TransferRatesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createTransferRatesRepository(supabase: DatabaseClient) {
  return new TransferRatesRepository(supabase)
}
