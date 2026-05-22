import { OrdersNotFoundException, OrdersServiceException } from "@/exceptions/orders/orders.exceptions"
import { OrdersRepository } from "@/repositories/orders/orders.repository"
import { BaseService } from "@/services/base/base.service"
import type { OrdersRow, OrdersUpdate } from "@/types/orders/orders.types"

export class OrdersService extends BaseService<"ordenes"> {
  constructor(repository: OrdersRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OrdersServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OrdersNotFoundException(criteria)
  }

  async getById(id: string): Promise<OrdersRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async getByCodigoReferencia(codigoReferencia: string) {
    return this.getOrThrow(
      { codigo_referencia: codigoReferencia },
      `codigo_referencia ${codigoReferencia}`,
    )
  }

  async listByUserId(userId: string) {
    return this.list({ usuario_id: userId })
  }

  async updateById(id: string, payload: OrdersUpdate) {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }
}

export function createOrdersService(repository: OrdersRepository) {
  return new OrdersService(repository)
}
