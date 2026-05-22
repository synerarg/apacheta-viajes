import {
  OrderItemsNotFoundException,
  OrderItemsServiceException,
} from "@/exceptions/order-items/order-items.exceptions"
import { OrderItemsRepository } from "@/repositories/order-items/order-items.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  OrderItemsRow,
  OrderItemsUpdate,
} from "@/types/order-items/order-items.types"

export class OrderItemsService extends BaseService<"ordenes_items"> {
  constructor(repository: OrderItemsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OrderItemsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OrderItemsNotFoundException(criteria)
  }

  async getById(id: string): Promise<OrderItemsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async listByOrderId(orderId: string) {
    return this.list({ orden_id: orderId })
  }

  async updateById(id: string, payload: OrderItemsUpdate) {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }
}

export function createOrderItemsService(repository: OrderItemsRepository) {
  return new OrderItemsService(repository)
}
