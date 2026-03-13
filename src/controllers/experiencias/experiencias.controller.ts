import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createExperienciasRepository } from "@/repositories/experiencias/experiencias.repository"
import {
  createExperienciasService,
  ExperienciasService,
} from "@/services/experiencias/experiencias.service"

export class ExperienciasController extends BaseIdController<"experiencias"> {
  constructor(service: ExperienciasService) {
    super(service)
  }
}

export async function createServerExperienciasController() {
  const supabase = await createClient()

  return new ExperienciasController(
    createExperienciasService(createExperienciasRepository(supabase)),
  )
}
