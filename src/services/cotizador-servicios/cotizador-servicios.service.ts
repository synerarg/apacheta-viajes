import {
  CotizadorServiciosNotFoundException,
  CotizadorServiciosServiceException,
} from "@/exceptions/cotizador-servicios/cotizador-servicios.exceptions"
import { CotizadorServiciosRepository } from "@/repositories/cotizador-servicios/cotizador-servicios.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  CotizadorServiciosRow,
  CotizadorServiciosUpdate,
} from "@/types/cotizador-servicios/cotizador-servicios.types"

export class CotizadorServiciosService extends BaseService<"cotizador_servicios"> {
  constructor(private readonly serviciosRepository: CotizadorServiciosRepository) {
    super(serviciosRepository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new CotizadorServiciosServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new CotizadorServiciosNotFoundException(criteria)
  }

  async getById(id: string): Promise<CotizadorServiciosRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: CotizadorServiciosUpdate): Promise<CotizadorServiciosRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }

  async findActiveByCategoria(categoriaId: string): Promise<CotizadorServiciosRow[]> {
    try {
      return await this.serviciosRepository.findActiveByCategoria(categoriaId)
    } catch (error) {
      this.handleServiceError("findActiveByCategoria", error)
    }
  }
}

export function createCotizadorServiciosService(repository: CotizadorServiciosRepository) {
  return new CotizadorServiciosService(repository)
}
