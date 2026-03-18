import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOrdenesItemsRepository } from "@/repositories/ordenes-items/ordenes-items.repository"
import {
  createOrdenesItemsService,
  OrdenesItemsService,
} from "@/services/ordenes-items/ordenes-items.service"

export class OrdenesItemsController extends BaseIdController<"ordenes_items"> {
  constructor(service: OrdenesItemsService) {
    super(service)
  }
}

export async function createServerOrdenesItemsController() {
  const supabase = await createClient()

  return new OrdenesItemsController(
    createOrdenesItemsService(createOrdenesItemsRepository(supabase)),
  )
}
