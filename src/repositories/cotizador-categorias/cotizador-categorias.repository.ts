import { CotizadorCategoriasRepositoryException } from "@/exceptions/cotizador-categorias/cotizador-categorias.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { CotizadorCategoriasUpdate } from "@/types/cotizador-categorias/cotizador-categorias.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class CotizadorCategoriasRepository extends BaseRepository<"cotizador_categorias"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizador_categorias")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new CotizadorCategoriasRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: CotizadorCategoriasUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createCotizadorCategoriasRepository(supabase: DatabaseClient) {
  return new CotizadorCategoriasRepository(supabase)
}
