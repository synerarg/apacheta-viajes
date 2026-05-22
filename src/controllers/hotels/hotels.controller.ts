import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createHotelesRepository } from "@/repositories/hoteles/hoteles.repository"
import { createHotelesService, HotelesService } from "@/services/hoteles/hoteles.service"

export class HotelesController extends BaseIdController<"hoteles"> {
  constructor(service: HotelesService) {
    super(service)
  }
}

export async function createServerHotelesController() {
  const supabase = await createClient()

  return new HotelesController(
    createHotelesService(createHotelesRepository(supabase)),
  )
}
