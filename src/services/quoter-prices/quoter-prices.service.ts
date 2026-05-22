import {
  QuoterPricesNotFoundException,
  QuoterPricesServiceException,
} from "@/exceptions/quoter-prices/quoter-prices.exceptions"
import { QuoterPricesRepository } from "@/repositories/quoter-prices/quoter-prices.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  QuoterPricesRow,
  QuoterPricesUpdate,
} from "@/types/quoter-prices/quoter-prices.types"

export class QuoterPricesService extends BaseService<"cotizador_servicio_precios"> {
  constructor(private readonly pricesRepository: QuoterPricesRepository) {
    super(pricesRepository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new QuoterPricesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new QuoterPricesNotFoundException(criteria)
  }

  async getById(id: string): Promise<QuoterPricesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: QuoterPricesUpdate): Promise<QuoterPricesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }

  async findByService(serviceId: string): Promise<QuoterPricesRow[]> {
    try {
      return await this.pricesRepository.findByService(serviceId)
    } catch (error) {
      this.handleServiceError("findByService", error)
    }
  }

  async findActiveForDate(serviceId: string, date: string): Promise<QuoterPricesRow | null> {
    try {
      return await this.pricesRepository.findActiveForDate(serviceId, date)
    } catch (error) {
      this.handleServiceError("findActiveForDate", error)
    }
  }

  async findByServiceSeason(
    serviceId: string,
    temporada: string,
  ): Promise<QuoterPricesRow | null> {
    try {
      return await this.pricesRepository.findByServiceSeason(serviceId, temporada)
    } catch (error) {
      this.handleServiceError("findByServiceSeason", error)
    }
  }
}

export function createQuoterPricesService(repository: QuoterPricesRepository) {
  return new QuoterPricesService(repository)
}
