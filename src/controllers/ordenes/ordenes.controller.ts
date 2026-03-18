import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOrdenesRepository } from "@/repositories/ordenes/ordenes.repository"
import { createOrdenesService, OrdenesService } from "@/services/ordenes/ordenes.service"

export class OrdenesController extends BaseIdController<"ordenes"> {
  constructor(service: OrdenesService) {
    super(service)
  }
}

export async function createServerOrdenesController() {
  const supabase = await createClient()

  return new OrdenesController(
    createOrdenesService(createOrdenesRepository(supabase)),
  )
}
