import { TransfersRepositoryException } from "@/exceptions/transfers/transfers.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { TransfersUpdate } from "@/types/transfers/transfers.types"

export class TransfersRepository extends BaseRepository<"traslados"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "traslados")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new TransfersRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: TransfersUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createTransfersRepository(supabase: DatabaseClient) {
  return new TransfersRepository(supabase)
}
