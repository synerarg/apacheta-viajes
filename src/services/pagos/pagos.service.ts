import { PagosNotFoundException, PagosServiceException } from "@/exceptions/pagos/pagos.exceptions"
import { PagosRepository } from "@/repositories/pagos/pagos.repository"
import { BaseService } from "@/services/base/base.service"
import type { PagosRow, PagosUpdate } from "@/types/pagos/pagos.types"

export class PagosService extends BaseService<"pagos"> {
  constructor(repository: PagosRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PagosServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PagosNotFoundException(criteria)
  }

  async getById(id: string): Promise<PagosRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async getByExternalReference(externalReference: string): Promise<PagosRow> {
    return this.getOrThrow(
      { external_reference: externalReference },
      `external_reference ${externalReference}`,
    )
  }

  async listByOrdenId(ordenId: string) {
    return this.list({ orden_id: ordenId })
  }

  async updateById(id: string, payload: PagosUpdate) {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }
}

export function createPagosService(repository: PagosRepository) {
  return new PagosService(repository)
}
