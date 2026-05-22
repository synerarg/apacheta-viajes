import { ExperiencesRepositoryException } from "@/exceptions/experiences/experiences.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { ExperiencesUpdate } from "@/types/experiences/experiences.types"

export class ExperiencesRepository extends BaseRepository<"experiencias"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "experiencias")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new ExperiencesRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: ExperiencesUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createExperiencesRepository(supabase: DatabaseClient) {
  return new ExperiencesRepository(supabase)
}
