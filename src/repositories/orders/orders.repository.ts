import { OrdersRepositoryException } from "@/exceptions/orders/orders.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { OrdersUpdate } from "@/types/orders/orders.types"

export class OrdersRepository extends BaseRepository<"ordenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "ordenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new OrdersRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async findByCodigoReferencia(codigoReferencia: string) {
    return this.findOne({ codigo_referencia: codigoReferencia })
  }

  async listByUserId(userId: string) {
    return this.findMany({ usuario_id: userId })
  }

  async updateById(id: string, payload: OrdersUpdate) {
    return this.update({ id }, payload)
  }
}

export function createOrdersRepository(supabase: DatabaseClient) {
  return new OrdersRepository(supabase)
}
