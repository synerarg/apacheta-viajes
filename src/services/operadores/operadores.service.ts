import {
  OperadoresNotFoundException,
  OperadoresServiceException,
} from "@/exceptions/operadores/operadores.exceptions"
import { OperadoresRepository } from "@/repositories/operadores/operadores.repository"
import { BaseService } from "@/services/base/base.service"
import type { OperadoresRow, OperadoresUpdate } from "@/types/operadores/operadores.types"

export class OperadoresService extends BaseService<"operadores"> {
  constructor(repository: OperadoresRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OperadoresServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OperadoresNotFoundException(criteria)
  }

  async getById(id: string): Promise<OperadoresRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async getByUsuarioId(usuarioId: string): Promise<OperadoresRow> {
    return this.getOrThrow({ usuario_id: usuarioId }, `usuario_id ${usuarioId}`)
  }

  async updateById(id: string, payload: OperadoresUpdate): Promise<OperadoresRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createOperadoresService(repository: OperadoresRepository) {
  return new OperadoresService(repository)
}
