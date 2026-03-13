import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPaquetesItinerarioRepository } from "@/repositories/paquetes-itinerario/paquetes-itinerario.repository"
import {
  createPaquetesItinerarioService,
  PaquetesItinerarioService,
} from "@/services/paquetes-itinerario/paquetes-itinerario.service"

export class PaquetesItinerarioController extends BaseIdController<"paquetes_itinerario"> {
  constructor(service: PaquetesItinerarioService) {
    super(service)
  }
}

export async function createServerPaquetesItinerarioController() {
  const supabase = await createClient()

  return new PaquetesItinerarioController(
    createPaquetesItinerarioService(
      createPaquetesItinerarioRepository(supabase),
    ),
  )
}
