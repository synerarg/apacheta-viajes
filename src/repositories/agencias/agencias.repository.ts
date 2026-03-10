import { AgenciasRepositoryException } from "@/exceptions/agencias/agencias.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { AgenciasUpdate } from "@/types/agencias/agencias.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class AgenciasRepository extends BaseRepository<"agencias"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "agencias")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new AgenciasRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: AgenciasUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createAgenciasRepository(supabase: DatabaseClient) {
  return new AgenciasRepository(supabase)
}
