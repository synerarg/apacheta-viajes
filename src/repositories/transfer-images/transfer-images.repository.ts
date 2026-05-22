import { TransferImagesRepositoryException } from "@/exceptions/transfer-images/transfer-images.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { TransferImagesUpdate } from "@/types/transfer-images/transfer-images.types"

export class TransferImagesRepository extends BaseRepository<"traslados_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "traslados_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new TransferImagesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: TransferImagesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createTransferImagesRepository(supabase: DatabaseClient) {
  return new TransferImagesRepository(supabase)
}
