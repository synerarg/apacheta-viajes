import {
  QuoterCategoriesNotFoundException,
  QuoterCategoriesServiceException,
} from "@/exceptions/quoter-categories/quoter-categories.exceptions"
import { QuoterCategoriesRepository } from "@/repositories/quoter-categories/quoter-categories.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  QuoterCategoriesRow,
  QuoterCategoriesUpdate,
} from "@/types/quoter-categories/quoter-categories.types"

export class QuoterCategoriesService extends BaseService<"cotizador_categorias"> {
  constructor(repository: QuoterCategoriesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new QuoterCategoriesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new QuoterCategoriesNotFoundException(criteria)
  }

  async getById(id: string): Promise<QuoterCategoriesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: QuoterCategoriesUpdate): Promise<QuoterCategoriesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createQuoterCategoriesService(repository: QuoterCategoriesRepository) {
  return new QuoterCategoriesService(repository)
}
