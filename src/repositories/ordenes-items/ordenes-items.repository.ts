import { OrdenesItemsRepositoryException } from "@/exceptions/ordenes-items/ordenes-items.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OrdenesItemsUpdate } from "@/types/ordenes-items/ordenes-items.types"

export class OrdenesItemsRepository extends BaseRepository<"ordenes_items"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "ordenes_items")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OrdenesItemsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async listByOrdenId(ordenId: string) {
    return this.findMany({ orden_id: ordenId })
  }

  async findByReservaId(reservaId: string) {
    return this.findOne({ reserva_id: reservaId })
  }

  async updateById(id: string, payload: OrdenesItemsUpdate) {
    return this.update({ id }, payload)
  }
}

export function createOrdenesItemsRepository(supabase: DatabaseClient) {
  return new OrdenesItemsRepository(supabase)
}
