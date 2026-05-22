import { QuoterCategoriesRepositoryException } from "@/exceptions/quoter-categories/quoter-categories.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { QuoterCategoriesUpdate } from "@/types/quoter-categories/quoter-categories.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class QuoterCategoriesRepository extends BaseRepository<"cotizador_categorias"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizador_categorias")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new QuoterCategoriesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: QuoterCategoriesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createQuoterCategoriesRepository(supabase: DatabaseClient) {
  return new QuoterCategoriesRepository(supabase)
}
