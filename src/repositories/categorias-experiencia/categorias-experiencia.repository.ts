import { CategoriasExperienciaRepositoryException } from "@/exceptions/categorias-experiencia/categorias-experiencia.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { CategoriasExperienciaUpdate } from "@/types/categorias-experiencia/categorias-experiencia.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class CategoriasExperienciaRepository extends BaseRepository<"categorias_experiencia"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "categorias_experiencia")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new CategoriasExperienciaRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: CategoriasExperienciaUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createCategoriasExperienciaRepository(
  supabase: DatabaseClient,
) {
  return new CategoriasExperienciaRepository(supabase)
}
