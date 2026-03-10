import { ReservasRepositoryException } from "@/exceptions/reservas/reservas.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { ReservasUpdate } from "@/types/reservas/reservas.types"

export class ReservasRepository extends BaseRepository<"reservas"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "reservas")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new ReservasRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: ReservasUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createReservasRepository(supabase: DatabaseClient) {
  return new ReservasRepository(supabase)
}
