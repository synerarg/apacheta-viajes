import { OutboundImagesRepositoryException } from "@/exceptions/outbound-images/outbound-images.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OutboundImagesUpdate } from "@/types/outbound-images/outbound-images.types"

export class OutboundImagesRepository extends BaseRepository<"emisivo_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "emisivo_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OutboundImagesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: OutboundImagesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createOutboundImagesRepository(supabase: DatabaseClient) {
  return new OutboundImagesRepository(supabase)
}
