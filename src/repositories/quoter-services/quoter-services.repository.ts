import { QuoterServicesRepositoryException } from "@/exceptions/quoter-services/quoter-services.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type {
  QuoterServicesRow,
  QuoterServicesUpdate,
} from "@/types/quoter-services/quoter-services.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class QuoterServicesRepository extends BaseRepository<"cotizador_servicios"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "cotizador_servicios")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new QuoterServicesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: QuoterServicesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }

  async findActiveByCategory(categoryId: string): Promise<QuoterServicesRow[]> {
    const { data, error } = await this.supabase
      .from("cotizador_servicios")
      .select("*")
      .eq("categoria_id", categoryId)
      .eq("activo", true)

    if (error) throw this.createRepositoryException("findActiveByCategory", error)
    return (data as QuoterServicesRow[]) ?? []
  }
}

export function createQuoterServicesRepository(supabase: DatabaseClient) {
  return new QuoterServicesRepository(supabase)
}
