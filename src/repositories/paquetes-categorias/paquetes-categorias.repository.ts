import { PaquetesCategoriasRepositoryException } from "@/exceptions/paquetes-categorias/paquetes-categorias.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PaquetesCategoriasUpdate } from "@/types/paquetes-categorias/paquetes-categorias.types"

export class PaquetesCategoriasRepository extends BaseRepository<"paquetes_categorias"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes_categorias")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PaquetesCategoriasRepositoryException(operation, cause)
  }

  async findByCompositeKey(paqueteId: string, categoriaId: string) {
    return this.findOne({
      paquete_id: paqueteId,
      categoria_id: categoriaId,
    })
  }

  async updateByCompositeKey(
    paqueteId: string,
    categoriaId: string,
    payload: PaquetesCategoriasUpdate,
  ) {
    return this.update(
      {
        paquete_id: paqueteId,
        categoria_id: categoriaId,
      },
      payload,
    )
  }

  async deleteByCompositeKey(paqueteId: string, categoriaId: string) {
    return this.delete({
      paquete_id: paqueteId,
      categoria_id: categoriaId,
    })
  }
}

export function createPaquetesCategoriasRepository(supabase: DatabaseClient) {
  return new PaquetesCategoriasRepository(supabase)
}
