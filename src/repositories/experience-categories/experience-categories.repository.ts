import { ExperienceCategoriesRepositoryException } from "@/exceptions/experience-categories/experience-categories.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { ExperienceCategoriesUpdate } from "@/types/experience-categories/experience-categories.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class ExperienceCategoriesRepository extends BaseRepository<"categorias_experiencia"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "categorias_experiencia")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new ExperienceCategoriesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: ExperienceCategoriesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createExperienceCategoriesRepository(
  supabase: DatabaseClient,
) {
  return new ExperienceCategoriesRepository(supabase)
}
