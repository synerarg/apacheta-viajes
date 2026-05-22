import { EmisivoImagenesRepositoryException } from "@/exceptions/emisivo-imagenes/emisivo-imagenes.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { EmisivoImagenesUpdate } from "@/types/emisivo-imagenes/emisivo-imagenes.types"

export class EmisivoImagenesRepository extends BaseRepository<"emisivo_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "emisivo_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new EmisivoImagenesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: EmisivoImagenesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createEmisivoImagenesRepository(supabase: DatabaseClient) {
  return new EmisivoImagenesRepository(supabase)
}
