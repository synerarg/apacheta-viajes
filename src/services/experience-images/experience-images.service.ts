import {
  ExperienceImagesNotFoundException,
  ExperienceImagesServiceException,
} from "@/exceptions/experience-images/experience-images.exceptions"
import { ExperienceImagesRepository } from "@/repositories/experience-images/experience-images.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  ExperienceImagesRow,
  ExperienceImagesUpdate,
} from "@/types/experience-images/experience-images.types"

export class ExperienceImagesService extends BaseService<"experiencias_imagenes"> {
  constructor(repository: ExperienceImagesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new ExperienceImagesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new ExperienceImagesNotFoundException(criteria)
  }

  async getById(id: string): Promise<ExperienceImagesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: ExperienceImagesUpdate,
  ): Promise<ExperienceImagesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createExperienceImagesService(
  repository: ExperienceImagesRepository,
) {
  return new ExperienceImagesService(repository)
}
