import { EstadisticasHomeRepositoryException } from "@/exceptions/estadisticas-home/estadisticas-home.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { EstadisticasHomeUpdate } from "@/types/estadisticas-home/estadisticas-home.types"

export class EstadisticasHomeRepository extends BaseRepository<"estadisticas_home"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "estadisticas_home")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new EstadisticasHomeRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: EstadisticasHomeUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createEstadisticasHomeRepository(supabase: DatabaseClient) {
  return new EstadisticasHomeRepository(supabase)
}
