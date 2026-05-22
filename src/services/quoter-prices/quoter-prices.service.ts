import {
  CotizadorPreciosNotFoundException,
  CotizadorPreciosServiceException,
} from "@/exceptions/cotizador-precios/cotizador-precios.exceptions"
import { CotizadorPreciosRepository } from "@/repositories/cotizador-precios/cotizador-precios.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  CotizadorPreciosRow,
  CotizadorPreciosUpdate,
} from "@/types/cotizador-precios/cotizador-precios.types"

export class CotizadorPreciosService extends BaseService<"cotizador_servicio_precios"> {
  constructor(private readonly preciosRepository: CotizadorPreciosRepository) {
    super(preciosRepository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new CotizadorPreciosServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new CotizadorPreciosNotFoundException(criteria)
  }

  async getById(id: string): Promise<CotizadorPreciosRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: CotizadorPreciosUpdate): Promise<CotizadorPreciosRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }

  async findByServicio(servicioId: string): Promise<CotizadorPreciosRow[]> {
    try {
      return await this.preciosRepository.findByServicio(servicioId)
    } catch (error) {
      this.handleServiceError("findByServicio", error)
    }
  }

  async findActiveForDate(servicioId: string, date: string): Promise<CotizadorPreciosRow | null> {
    try {
      return await this.preciosRepository.findActiveForDate(servicioId, date)
    } catch (error) {
      this.handleServiceError("findActiveForDate", error)
    }
  }

  async findByServicioTemporada(
    servicioId: string,
    temporada: string,
  ): Promise<CotizadorPreciosRow | null> {
    try {
      return await this.preciosRepository.findByServicioTemporada(servicioId, temporada)
    } catch (error) {
      this.handleServiceError("findByServicioTemporada", error)
    }
  }
}

export function createCotizadorPreciosService(repository: CotizadorPreciosRepository) {
  return new CotizadorPreciosService(repository)
}
