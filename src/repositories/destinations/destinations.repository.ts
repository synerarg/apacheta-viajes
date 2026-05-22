import { DestinationsRepositoryException } from "@/exceptions/destinations/destinations.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { DestinationsUpdate } from "@/types/destinations/destinations.types"

export class DestinationsRepository extends BaseRepository<"destinos"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "destinos")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new DestinationsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: DestinationsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createDestinationsRepository(supabase: DatabaseClient) {
  return new DestinationsRepository(supabase)
}
