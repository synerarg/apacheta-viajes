import { CotizacionesRepositoryException } from "@/exceptions/cotizaciones/cotizaciones.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  CotizacionesRow,
  CotizacionesUpdate,
} from "@/types/cotizaciones/cotizaciones.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class CotizacionesRepository extends BaseRepository<"cotizaciones"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizaciones")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new CotizacionesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: CotizacionesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async listByOperador(operadorId: string): Promise<CotizacionesRow[]> {
    const { data, error } = await this.supabase
      .from("cotizaciones")
      .select("*")
      .eq("operador_id", operadorId)
      .order("created_at", { ascending: false })

    if (error) throw this.createRepositoryException("listByOperador", error)
    return (data as CotizacionesRow[]) ?? []
  }

  async listAll(): Promise<CotizacionesRow[]> {
    const { data, error } = await this.supabase
      .from("cotizaciones")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw this.createRepositoryException("listAll", error)
    return (data as CotizacionesRow[]) ?? []
  }

  async findByToken(token: string): Promise<CotizacionesRow | null> {
    const { data, error } = await this.supabase
      .from("cotizaciones")
      .select("*")
      .eq("token", token)
      .maybeSingle()

    if (error) throw this.createRepositoryException("findByToken", error)
    return (data as CotizacionesRow | null) ?? null
  }
}

export function createCotizacionesRepository(supabase: DatabaseClient) {
  return new CotizacionesRepository(supabase)
}
