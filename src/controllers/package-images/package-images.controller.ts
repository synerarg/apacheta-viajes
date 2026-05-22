import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPaquetesImagenesRepository } from "@/repositories/paquetes-imagenes/paquetes-imagenes.repository"
import {
  createPaquetesImagenesService,
  PaquetesImagenesService,
} from "@/services/paquetes-imagenes/paquetes-imagenes.service"

export class PaquetesImagenesController extends BaseIdController<"paquetes_imagenes"> {
  constructor(service: PaquetesImagenesService) {
    super(service)
  }
}

export async function createServerPaquetesImagenesController() {
  const supabase = await createClient()

  return new PaquetesImagenesController(
    createPaquetesImagenesService(createPaquetesImagenesRepository(supabase)),
  )
}
