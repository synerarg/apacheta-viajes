import { EmisivoDestinosRepositoryException } from "@/exceptions/emisivo-destinos/emisivo-destinos.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { EmisivoDestinosUpdate } from "@/types/emisivo-destinos/emisivo-destinos.types"

export class EmisivoDestinosRepository extends BaseRepository<"emisivo_destinos"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "emisivo_destinos")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new EmisivoDestinosRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: EmisivoDestinosUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createEmisivoDestinosRepository(supabase: DatabaseClient) {
  return new EmisivoDestinosRepository(supabase)
}
