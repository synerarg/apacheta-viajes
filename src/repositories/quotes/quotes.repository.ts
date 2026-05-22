import { QuotesRepositoryException } from "@/exceptions/quotes/quotes.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  QuotesRow,
  QuotesUpdate,
} from "@/types/quotes/quotes.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class QuotesRepository extends BaseRepository<"cotizaciones"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizaciones")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new QuotesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: QuotesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async listByOperador(operatorId: string): Promise<QuotesRow[]> {
    const { data, error } = await this.supabase
      .from("cotizaciones")
      .select("*")
      .eq("operador_id", operatorId)
      .order("created_at", { ascending: false })

    if (error) throw this.createRepositoryException("listByOperador", error)
    return (data as QuotesRow[]) ?? []
  }

  async listAll(): Promise<QuotesRow[]> {
    const { data, error } = await this.supabase
      .from("cotizaciones")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw this.createRepositoryException("listAll", error)
    return (data as QuotesRow[]) ?? []
  }

  async findByToken(token: string): Promise<QuotesRow | null> {
    const { data, error } = await this.supabase
      .from("cotizaciones")
      .select("*")
      .eq("token", token)
      .maybeSingle()

    if (error) throw this.createRepositoryException("findByToken", error)
    return (data as QuotesRow | null) ?? null
  }
}

export function createQuotesRepository(supabase: DatabaseClient) {
  return new QuotesRepository(supabase)
}
