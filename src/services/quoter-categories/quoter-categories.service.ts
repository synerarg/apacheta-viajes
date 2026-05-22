import {
  CotizadorCategoriasNotFoundException,
  CotizadorCategoriasServiceException,
} from "@/exceptions/cotizador-categorias/cotizador-categorias.exceptions"
import { CotizadorCategoriasRepository } from "@/repositories/cotizador-categorias/cotizador-categorias.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  CotizadorCategoriasRow,
  CotizadorCategoriasUpdate,
} from "@/types/cotizador-categorias/cotizador-categorias.types"

export class CotizadorCategoriasService extends BaseService<"cotizador_categorias"> {
  constructor(repository: CotizadorCategoriasRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new CotizadorCategoriasServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new CotizadorCategoriasNotFoundException(criteria)
  }

  async getById(id: string): Promise<CotizadorCategoriasRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: CotizadorCategoriasUpdate): Promise<CotizadorCategoriasRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createCotizadorCategoriasService(repository: CotizadorCategoriasRepository) {
  return new CotizadorCategoriasService(repository)
}
