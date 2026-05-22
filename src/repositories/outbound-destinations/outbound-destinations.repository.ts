import { OutboundDestinationsRepositoryException } from "@/exceptions/outbound-destinations/outbound-destinations.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OutboundDestinationsUpdate } from "@/types/outbound-destinations/outbound-destinations.types"

export class OutboundDestinationsRepository extends BaseRepository<"emisivo_destinos"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "emisivo_destinos")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OutboundDestinationsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: OutboundDestinationsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createOutboundDestinationsRepository(supabase: DatabaseClient) {
  return new OutboundDestinationsRepository(supabase)
}
