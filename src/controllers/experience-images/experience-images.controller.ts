import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createExperienceImagesRepository } from "@/repositories/experience-images/experience-images.repository"
import {
  createExperienceImagesService,
  ExperienceImagesService,
} from "@/services/experience-images/experience-images.service"

export class ExperienceImagesController extends BaseIdController<"experiencias_imagenes"> {
  constructor(service: ExperienceImagesService) {
    super(service)
  }
}

export async function createServerExperienceImagesController() {
  const supabase = await createClient()

  return new ExperienceImagesController(
    createExperienceImagesService(
      createExperienceImagesRepository(supabase),
    ),
  )
}
