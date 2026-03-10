import { ExperienciasRepositoryException } from "@/exceptions/experiencias/experiencias.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { ExperienciasUpdate } from "@/types/experiencias/experiencias.types"

export class ExperienciasRepository extends BaseRepository<"experiencias"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "experiencias")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new ExperienciasRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: ExperienciasUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createExperienciasRepository(supabase: DatabaseClient) {
  return new ExperienciasRepository(supabase)
}
