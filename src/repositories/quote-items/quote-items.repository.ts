import { QuoteItemsRepositoryException } from "@/exceptions/quote-items/quote-items.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  QuoteItemsRow,
  QuoteItemsUpdate,
} from "@/types/quote-items/quote-items.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class QuoteItemsRepository extends BaseRepository<"cotizaciones_items"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizaciones_items")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new QuoteItemsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: QuoteItemsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async listByCotizacion(quoteId: string): Promise<QuoteItemsRow[]> {
    const { data, error } = await this.supabase
      .from("cotizaciones_items")
      .select("*")
      .eq("cotizacion_id", quoteId)
      .order("dia_offset", { ascending: true })
      .order("orden", { ascending: true })

    if (error) throw this.createRepositoryException("listByCotizacion", error)
    return (data as QuoteItemsRow[]) ?? []
  }
}

export function createQuoteItemsRepository(supabase: DatabaseClient) {
  return new QuoteItemsRepository(supabase)
}
