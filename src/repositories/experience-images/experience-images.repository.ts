import { ExperienceImagesRepositoryException } from "@/exceptions/experience-images/experience-images.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { ExperienceImagesUpdate } from "@/types/experience-images/experience-images.types"

export class ExperienceImagesRepository extends BaseRepository<"experiencias_imagenes"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "experiencias_imagenes")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new ExperienceImagesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: ExperienceImagesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createExperienceImagesRepository(supabase: DatabaseClient) {
  return new ExperienceImagesRepository(supabase)
}
