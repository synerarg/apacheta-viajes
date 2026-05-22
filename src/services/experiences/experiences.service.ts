import {
  ExperiencesNotFoundException,
  ExperiencesServiceException,
} from "@/exceptions/experiences/experiences.exceptions"
import { ExperiencesRepository } from "@/repositories/experiences/experiences.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  ExperiencesRow,
  ExperiencesUpdate,
} from "@/types/experiences/experiences.types"

export class ExperiencesService extends BaseService<"experiencias"> {
  constructor(repository: ExperiencesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new ExperiencesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new ExperiencesNotFoundException(criteria)
  }

  async getById(id: string): Promise<ExperiencesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: ExperiencesUpdate,
  ): Promise<ExperiencesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createExperiencesService(repository: ExperiencesRepository) {
  return new ExperiencesService(repository)
}
