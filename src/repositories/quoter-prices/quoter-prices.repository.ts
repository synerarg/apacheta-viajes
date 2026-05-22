import { QuoterPricesRepositoryException } from "@/exceptions/quoter-prices/quoter-prices.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  QuoterPricesRow,
  QuoterPricesUpdate,
} from "@/types/quoter-prices/quoter-prices.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class QuoterPricesRepository extends BaseRepository<"cotizador_servicio_precios"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizador_servicio_precios")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new QuoterPricesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: QuoterPricesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async findByService(serviceId: string): Promise<QuoterPricesRow[]> {
    const { data, error } = await this.supabase
      .from("cotizador_servicio_precios")
      .select("*")
      .eq("servicio_id", serviceId)

    if (error) throw this.createRepositoryException("findByService", error)
    return (data as QuoterPricesRow[]) ?? []
  }

  async findActiveForDate(
    serviceId: string,
    date: string,
  ): Promise<QuoterPricesRow | null> {
    const { data, error } = await this.supabase
      .from("cotizador_servicio_precios")
      .select("*")
      .eq("servicio_id", serviceId)

    if (error) throw this.createRepositoryException("findActiveForDate", error)
    const rows = (data as QuoterPricesRow[]) ?? []
    const match = rows.find(
      (r) =>
        r.vigencia_desde &&
        r.vigencia_hasta &&
        r.vigencia_desde <= date &&
        r.vigencia_hasta >= date,
    )
    return match ?? null
  }

  async findByServiceSeason(
    serviceId: string,
    temporada: string,
  ): Promise<QuoterPricesRow | null> {
    const { data, error } = await this.supabase
      .from("cotizador_servicio_precios")
      .select("*")
      .eq("servicio_id", serviceId)
      .eq("temporada", temporada)
      .maybeSingle()

    if (error) throw this.createRepositoryException("findByServiceSeason", error)
    return (data as QuoterPricesRow | null) ?? null
  }
}

export function createQuoterPricesRepository(supabase: DatabaseClient) {
  return new QuoterPricesRepository(supabase)
}
