import { TrasladosImagenesRepositoryException } from "@/exceptions/traslados-imagenes/traslados-imagenes.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { TrasladosImagenesUpdate } from "@/types/traslados-imagenes/traslados-imagenes.types"

export class TrasladosImagenesRepository extends BaseRepository<"traslados_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "traslados_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new TrasladosImagenesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: TrasladosImagenesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createTrasladosImagenesRepository(supabase: DatabaseClient) {
  return new TrasladosImagenesRepository(supabase)
}
