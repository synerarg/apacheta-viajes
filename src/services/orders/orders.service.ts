import { OrdenesNotFoundException, OrdenesServiceException } from "@/exceptions/ordenes/ordenes.exceptions"
import { OrdenesRepository } from "@/repositories/ordenes/ordenes.repository"
import { BaseService } from "@/services/base/base.service"
import type { OrdenesRow, OrdenesUpdate } from "@/types/ordenes/ordenes.types"

export class OrdenesService extends BaseService<"ordenes"> {
  constructor(repository: OrdenesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OrdenesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OrdenesNotFoundException(criteria)
  }

  async getById(id: string): Promise<OrdenesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async getByCodigoReferencia(codigoReferencia: string) {
    return this.getOrThrow(
      { codigo_referencia: codigoReferencia },
      `codigo_referencia ${codigoReferencia}`,
    )
  }

  async listByUsuarioId(usuarioId: string) {
    return this.list({ usuario_id: usuarioId })
  }

  async updateById(id: string, payload: OrdenesUpdate) {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }
}

export function createOrdenesService(repository: OrdenesRepository) {
  return new OrdenesService(repository)
}
