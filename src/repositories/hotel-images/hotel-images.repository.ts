import { HotelesImagenesRepositoryException } from "@/exceptions/hoteles-imagenes/hoteles-imagenes.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { HotelesImagenesUpdate } from "@/types/hoteles-imagenes/hoteles-imagenes.types"

export class HotelesImagenesRepository extends BaseRepository<"hoteles_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "hoteles_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new HotelesImagenesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: HotelesImagenesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createHotelesImagenesRepository(supabase: DatabaseClient) {
  return new HotelesImagenesRepository(supabase)
}
