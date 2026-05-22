import {
  ExperienceCategoriesNotFoundException,
  ExperienceCategoriesServiceException,
} from "@/exceptions/experience-categories/experience-categories.exceptions"
import { ExperienceCategoriesRepository } from "@/repositories/experience-categories/experience-categories.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  ExperienceCategoriesRow,
  ExperienceCategoriesUpdate,
} from "@/types/experience-categories/experience-categories.types"

export class ExperienceCategoriesService extends BaseService<"categorias_experiencia"> {
  constructor(repository: ExperienceCategoriesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new ExperienceCategoriesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new ExperienceCategoriesNotFoundException(criteria)
  }

  async getById(id: string): Promise<ExperienceCategoriesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: ExperienceCategoriesUpdate,
  ): Promise<ExperienceCategoriesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createExperienceCategoriesService(
  repository: ExperienceCategoriesRepository,
) {
  return new ExperienceCategoriesService(repository)
}
