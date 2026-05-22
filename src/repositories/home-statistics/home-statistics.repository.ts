import { HomeStatisticsRepositoryException } from "@/exceptions/home-statistics/home-statistics.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { HomeStatisticsUpdate } from "@/types/home-statistics/home-statistics.types"

export class HomeStatisticsRepository extends BaseRepository<"estadisticas_home"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "estadisticas_home")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new HomeStatisticsRepositoryException(operation, cause)
  }

  async findById(id: string) {
    return this.findOne({ id })
  }

  async updateById(id: string, payload: HomeStatisticsUpdate) {
    return this.update({ id }, payload)
  }

  async deleteById(id: string) {
    return this.delete({ id })
  }
}

export function createHomeStatisticsRepository(supabase: DatabaseClient) {
  return new HomeStatisticsRepository(supabase)
}
