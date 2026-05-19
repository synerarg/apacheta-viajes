import { OperadoresRepositoryException } from "@/exceptions/operadores/operadores.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { OperadoresUpdate } from "@/types/operadores/operadores.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class OperadoresRepository extends BaseRepository<"operadores"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "operadores")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OperadoresRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async findByUsuarioId(usuarioId: string) {
    return this.findOne({ usuario_id: usuarioId })
  }

  async updateById(id: string, payload: OperadoresUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createOperadoresRepository(supabase: DatabaseClient) {
  return new OperadoresRepository(supabase)
}
