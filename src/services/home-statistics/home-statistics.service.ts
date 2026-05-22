import {
  HomeStatisticsNotFoundException,
  HomeStatisticsServiceException,
} from "@/exceptions/home-statistics/home-statistics.exceptions"
import { HomeStatisticsRepository } from "@/repositories/home-statistics/home-statistics.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  HomeStatisticsRow,
  HomeStatisticsUpdate,
} from "@/types/home-statistics/home-statistics.types"

export class HomeStatisticsService extends BaseService<"estadisticas_home"> {
  constructor(repository: HomeStatisticsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new HomeStatisticsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new HomeStatisticsNotFoundException(criteria)
  }

  async getById(id: string): Promise<HomeStatisticsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: HomeStatisticsUpdate,
  ): Promise<HomeStatisticsRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createHomeStatisticsService(
  repository: HomeStatisticsRepository,
) {
  return new HomeStatisticsService(repository)
}
