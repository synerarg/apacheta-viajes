import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createHotelesImagenesRepository } from "@/repositories/hoteles-imagenes/hoteles-imagenes.repository"
import {
  createHotelesImagenesService,
  HotelesImagenesService,
} from "@/services/hoteles-imagenes/hoteles-imagenes.service"

export class HotelesImagenesController extends BaseIdController<"hoteles_imagenes"> {
  constructor(service: HotelesImagenesService) {
    super(service)
  }
}

export async function createServerHotelesImagenesController() {
  const supabase = await createClient()

  return new HotelesImagenesController(
    createHotelesImagenesService(createHotelesImagenesRepository(supabase)),
  )
}
