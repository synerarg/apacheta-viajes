import { PagosEventosRepositoryException } from "@/exceptions/pagos-eventos/pagos-eventos.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PagosEventosUpdate } from "@/types/pagos-eventos/pagos-eventos.types"

export class PagosEventosRepository extends BaseRepository<"pagos_eventos"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "pagos_eventos")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PagosEventosRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async listByPagoId(pagoId: string) {
    return this.findMany({ pago_id: pagoId })
  }

  async updateById(id: string, payload: PagosEventosUpdate) {
    return this.update({ id }, payload)
  }
}

export function createPagosEventosRepository(supabase: DatabaseClient) {
  return new PagosEventosRepository(supabase)
}
