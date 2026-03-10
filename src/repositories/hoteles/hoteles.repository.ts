import { HotelesRepositoryException } from "@/exceptions/hoteles/hoteles.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { HotelesUpdate } from "@/types/hoteles/hoteles.types"

export class HotelesRepository extends BaseRepository<"hoteles"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "hoteles")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new HotelesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: HotelesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createHotelesRepository(supabase: DatabaseClient) {
  return new HotelesRepository(supabase)
}
