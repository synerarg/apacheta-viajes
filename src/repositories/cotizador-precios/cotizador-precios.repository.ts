import { CotizadorPreciosRepositoryException } from "@/exceptions/cotizador-precios/cotizador-precios.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  CotizadorPreciosRow,
  CotizadorPreciosUpdate,
} from "@/types/cotizador-precios/cotizador-precios.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class CotizadorPreciosRepository extends BaseRepository<"cotizador_servicio_precios"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizador_servicio_precios")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new CotizadorPreciosRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: CotizadorPreciosUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async findByServicio(servicioId: string): Promise<CotizadorPreciosRow[]> {
    const { data, error } = await this.supabase
      .from("cotizador_servicio_precios")
      .select("*")
      .eq("servicio_id", servicioId)

    if (error) throw this.createRepositoryException("findByServicio", error)
    return (data as CotizadorPreciosRow[]) ?? []
  }

  async findActiveForDate(
    servicioId: string,
    date: string,
  ): Promise<CotizadorPreciosRow | null> {
    const { data, error } = await this.supabase
      .from("cotizador_servicio_precios")
      .select("*")
      .eq("servicio_id", servicioId)

    if (error) throw this.createRepositoryException("findActiveForDate", error)
    const rows = (data as CotizadorPreciosRow[]) ?? []
    const match = rows.find(
      (r) =>
        r.vigencia_desde &&
        r.vigencia_hasta &&
        r.vigencia_desde <= date &&
        r.vigencia_hasta >= date,
    )
    return match ?? null
  }

  async findByServicioTemporada(
    servicioId: string,
    temporada: string,
  ): Promise<CotizadorPreciosRow | null> {
    const { data, error } = await this.supabase
      .from("cotizador_servicio_precios")
      .select("*")
      .eq("servicio_id", servicioId)
      .eq("temporada", temporada)
      .maybeSingle()

    if (error) throw this.createRepositoryException("findByServicioTemporada", error)
    return (data as CotizadorPreciosRow | null) ?? null
  }
}

export function createCotizadorPreciosRepository(supabase: DatabaseClient) {
  return new CotizadorPreciosRepository(supabase)
}
