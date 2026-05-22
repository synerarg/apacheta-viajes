import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPaquetesRepository } from "@/repositories/paquetes/paquetes.repository"
import { createPaquetesService, PaquetesService } from "@/services/paquetes/paquetes.service"

export class PaquetesController extends BaseIdController<"paquetes"> {
  constructor(service: PaquetesService) {
    super(service)
  }
}

export async function createServerPaquetesController() {
  const supabase = await createClient()

  return new PaquetesController(
    createPaquetesService(createPaquetesRepository(supabase)),
  )
}
