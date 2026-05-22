import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOrdersRepository } from "@/repositories/orders/orders.repository"
import { createOrdersService, OrdersService } from "@/services/orders/orders.service"

export class OrdersController extends BaseIdController<"ordenes"> {
  constructor(service: OrdersService) {
    super(service)
  }
}

export async function createServerOrdersController() {
  const supabase = await createClient()

  return new OrdersController(
    createOrdersService(createOrdersRepository(supabase)),
  )
}
