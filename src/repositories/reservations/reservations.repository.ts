import { ReservationsRepositoryException } from "@/exceptions/reservations/reservations.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { ReservationsUpdate } from "@/types/reservations/reservations.types"

export class ReservationsRepository extends BaseRepository<"reservas"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "reservas")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new ReservationsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: ReservationsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createReservationsRepository(supabase: DatabaseClient) {
  return new ReservationsRepository(supabase)
}
