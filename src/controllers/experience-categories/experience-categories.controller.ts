import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createExperienceCategoriesRepository } from "@/repositories/experience-categories/experience-categories.repository"
import {
  ExperienceCategoriesService,
  createExperienceCategoriesService,
} from "@/services/experience-categories/experience-categories.service"

export class ExperienceCategoriesController extends BaseIdController<"categorias_experiencia"> {
  constructor(service: ExperienceCategoriesService) {
    super(service)
  }
}

export async function createServerExperienceCategoriesController() {
  const supabase = await createClient()

  return new ExperienceCategoriesController(
    createExperienceCategoriesService(
      createExperienceCategoriesRepository(supabase),
    ),
  )
}
