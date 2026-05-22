import {
  QuoterServicesNotFoundException,
  QuoterServicesServiceException,
} from "@/exceptions/quoter-services/quoter-services.exceptions"
import { QuoterServicesRepository } from "@/repositories/quoter-services/quoter-services.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  QuoterServicesRow,
  QuoterServicesUpdate,
} from "@/types/quoter-services/quoter-services.types"

export class QuoterServicesService extends BaseService<"cotizador_servicios"> {
  constructor(private readonly servicesRepository: QuoterServicesRepository) {
    super(servicesRepository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new QuoterServicesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new QuoterServicesNotFoundException(criteria)
  }

  async getById(id: string): Promise<QuoterServicesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: QuoterServicesUpdate): Promise<QuoterServicesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }

  async findActiveByCategory(categoryId: string): Promise<QuoterServicesRow[]> {
    try {
      return await this.servicesRepository.findActiveByCategory(categoryId)
    } catch (error) {
      this.handleServiceError("findActiveByCategory", error)
    }
  }
}

export function createQuoterServicesService(repository: QuoterServicesRepository) {
  return new QuoterServicesService(repository)
}
