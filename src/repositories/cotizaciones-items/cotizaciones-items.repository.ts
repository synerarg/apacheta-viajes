import { CotizacionesItemsRepositoryException } from "@/exceptions/cotizaciones-items/cotizaciones-items.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  CotizacionesItemsRow,
  CotizacionesItemsUpdate,
} from "@/types/cotizaciones-items/cotizaciones-items.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class CotizacionesItemsRepository extends BaseRepository<"cotizaciones_items"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizaciones_items")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new CotizacionesItemsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: CotizacionesItemsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async listByCotizacion(cotizacionId: string): Promise<CotizacionesItemsRow[]> {
    const { data, error } = await this.supabase
      .from("cotizaciones_items")
      .select("*")
      .eq("cotizacion_id", cotizacionId)
      .order("dia_offset", { ascending: true })
      .order("orden", { ascending: true })

    if (error) throw this.createRepositoryException("listByCotizacion", error)
    return (data as CotizacionesItemsRow[]) ?? []
  }
}

export function createCotizacionesItemsRepository(supabase: DatabaseClient) {
  return new CotizacionesItemsRepository(supabase)
}
