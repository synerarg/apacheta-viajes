import { DestinosRepositoryException } from "@/exceptions/destinos/destinos.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { DestinosUpdate } from "@/types/destinos/destinos.types"

export class DestinosRepository extends BaseRepository<"destinos"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "destinos")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new DestinosRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: DestinosUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createDestinosRepository(supabase: DatabaseClient) {
  return new DestinosRepository(supabase)
}
