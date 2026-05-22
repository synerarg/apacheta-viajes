import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createExperiencesRepository } from "@/repositories/experiences/experiences.repository"
import {
  createExperiencesService,
  ExperiencesService,
} from "@/services/experiences/experiences.service"

export class ExperiencesController extends BaseIdController<"experiencias"> {
  constructor(service: ExperiencesService) {
    super(service)
  }
}

export async function createServerExperiencesController() {
  const supabase = await createClient()

  return new ExperiencesController(
    createExperiencesService(createExperiencesRepository(supabase)),
  )
}
