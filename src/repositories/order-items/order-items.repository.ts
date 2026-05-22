import { OrderItemsRepositoryException } from "@/exceptions/order-items/order-items.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OrderItemsUpdate } from "@/types/order-items/order-items.types"

export class OrderItemsRepository extends BaseRepository<"ordenes_items"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "ordenes_items")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OrderItemsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async listByOrderId(orderId: string) {
    return this.findMany({ orden_id: orderId })
  }

  async findByReservationId(reservationId: string) {
    return this.findOne({ reserva_id: reservationId })
  }

  async updateById(id: string, payload: OrderItemsUpdate) {
    return this.update({ id }, payload)
  }
}

export function createOrderItemsRepository(supabase: DatabaseClient) {
  return new OrderItemsRepository(supabase)
}
