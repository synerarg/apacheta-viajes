import { OrdenesRepositoryException } from "@/exceptions/ordenes/ordenes.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OrdenesUpdate } from "@/types/ordenes/ordenes.types"

export class OrdenesRepository extends BaseRepository<"ordenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "ordenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OrdenesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async findByCodigoReferencia(codigoReferencia: string) {
    return this.findOne({ codigo_referencia: codigoReferencia })
  }

  async listByUsuarioId(usuarioId: string) {
    return this.findMany({ usuario_id: usuarioId })
  }

  async updateById(id: string, payload: OrdenesUpdate) {
    return this.update({ id }, payload)
  }
}

export function createOrdenesRepository(supabase: DatabaseClient) {
  return new OrdenesRepository(supabase)
}
