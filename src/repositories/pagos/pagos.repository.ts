import { PagosRepositoryException } from "@/exceptions/pagos/pagos.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PagosUpdate } from "@/types/pagos/pagos.types"

export class PagosRepository extends BaseRepository<"pagos"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "pagos")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PagosRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async findByExternalReference(externalReference: string) {
    return this.findOne({ external_reference: externalReference })
  }

  async listByOrdenId(ordenId: string) {
    return this.findMany({ orden_id: ordenId })
  }

  async updateById(id: string, payload: PagosUpdate) {
    return this.update({ id }, payload)
  }
}

export function createPagosRepository(supabase: DatabaseClient) {
  return new PagosRepository(supabase)
}
