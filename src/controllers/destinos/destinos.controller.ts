import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createDestinosRepository } from "@/repositories/destinos/destinos.repository"
import { createDestinosService, DestinosService } from "@/services/destinos/destinos.service"

export class DestinosController extends BaseIdController<"destinos"> {
  constructor(service: DestinosService) {
    super(service)
  }
}

export async function createServerDestinosController() {
  const supabase = await createClient()

  return new DestinosController(
    createDestinosService(createDestinosRepository(supabase)),
  )
}
