import { TrasladosRepositoryException } from "@/exceptions/traslados/traslados.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { TrasladosUpdate } from "@/types/traslados/traslados.types"

export class TrasladosRepository extends BaseRepository<"traslados"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "traslados")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new TrasladosRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: TrasladosUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createTrasladosRepository(supabase: DatabaseClient) {
  return new TrasladosRepository(supabase)
}
