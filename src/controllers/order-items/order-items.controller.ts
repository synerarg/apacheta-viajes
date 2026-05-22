import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOrderItemsRepository } from "@/repositories/order-items/order-items.repository"
import {
  createOrderItemsService,
  OrderItemsService,
} from "@/services/order-items/order-items.service"

export class OrderItemsController extends BaseIdController<"ordenes_items"> {
  constructor(service: OrderItemsService) {
    super(service)
  }
}

export async function createServerOrderItemsController() {
  const supabase = await createClient()

  return new OrderItemsController(
    createOrderItemsService(createOrderItemsRepository(supabase)),
  )
}
