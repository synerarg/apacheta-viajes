import { ExperienciasImagenesRepositoryException } from "@/exceptions/experiencias-imagenes/experiencias-imagenes.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { ExperienciasImagenesUpdate } from "@/types/experiencias-imagenes/experiencias-imagenes.types"

export class ExperienciasImagenesRepository extends BaseRepository<"experiencias_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "experiencias_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new ExperienciasImagenesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: ExperienciasImagenesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createExperienciasImagenesRepository(supabase: DatabaseClient) {
  return new ExperienciasImagenesRepository(supabase)
}
