import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createExperienciasImagenesRepository } from "@/repositories/experiencias-imagenes/experiencias-imagenes.repository"
import {
  createExperienciasImagenesService,
  ExperienciasImagenesService,
} from "@/services/experiencias-imagenes/experiencias-imagenes.service"

export class ExperienciasImagenesController extends BaseIdController<"experiencias_imagenes"> {
  constructor(service: ExperienciasImagenesService) {
    super(service)
  }
}

export async function createServerExperienciasImagenesController() {
  const supabase = await createClient()

  return new ExperienciasImagenesController(
    createExperienciasImagenesService(
      createExperienciasImagenesRepository(supabase),
    ),
  )
}
