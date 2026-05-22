import { CotizadorServiciosRepositoryException } from "@/exceptions/cotizador-servicios/cotizador-servicios.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  CotizadorServiciosRow,
  CotizadorServiciosUpdate,
} from "@/types/cotizador-servicios/cotizador-servicios.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class CotizadorServiciosRepository extends BaseRepository<"cotizador_servicios"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizador_servicios")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new CotizadorServiciosRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: CotizadorServiciosUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async findActiveByCategoria(categoriaId: string): Promise<CotizadorServiciosRow[]> {
    const { data, error } = await this.supabase
      .from("cotizador_servicios")
      .select("*")
      .eq("categoria_id", categoriaId)
      .eq("activo", true)

    if (error) throw this.createRepositoryException("findActiveByCategoria", error)
    return (data as CotizadorServiciosRow[]) ?? []
  }
}

export function createCotizadorServiciosRepository(supabase: DatabaseClient) {
  return new CotizadorServiciosRepository(supabase)
}
