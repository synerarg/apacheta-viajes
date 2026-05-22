import { HotelsRepositoryException } from "@/exceptions/hotels/hotels.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { HotelsUpdate } from "@/types/hotels/hotels.types"

export class HotelsRepository extends BaseRepository<"hoteles"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "hoteles")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new HotelsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: HotelsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createHotelsRepository(supabase: DatabaseClient) {
  return new HotelsRepository(supabase)
}
