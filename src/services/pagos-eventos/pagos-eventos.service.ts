import {
  PagosEventosNotFoundException,
  PagosEventosServiceException,
} from "@/exceptions/pagos-eventos/pagos-eventos.exceptions"
import { PagosEventosRepository } from "@/repositories/pagos-eventos/pagos-eventos.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PagosEventosRow,
  PagosEventosUpdate,
} from "@/types/pagos-eventos/pagos-eventos.types"

export class PagosEventosService extends BaseService<"pagos_eventos"> {
  constructor(repository: PagosEventosRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PagosEventosServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PagosEventosNotFoundException(criteria)
  }

  async getById(id: string): Promise<PagosEventosRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async listByPagoId(pagoId: string) {
    return this.list({ pago_id: pagoId })
  }

  async updateById(id: string, payload: PagosEventosUpdate) {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }
}

export function createPagosEventosService(repository: PagosEventosRepository) {
  return new PagosEventosService(repository)
}
