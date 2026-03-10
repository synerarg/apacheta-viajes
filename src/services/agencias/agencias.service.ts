import {
  AgenciasNotFoundException,
  AgenciasServiceException,
} from "@/exceptions/agencias/agencias.exceptions"
import { AgenciasRepository } from "@/repositories/agencias/agencias.repository"
import { BaseService } from "@/services/base/base.service"
import type { AgenciasRow, AgenciasUpdate } from "@/types/agencias/agencias.types"

export class AgenciasService extends BaseService<"agencias"> {
  constructor(repository: AgenciasRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new AgenciasServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new AgenciasNotFoundException(criteria)
  }

  async getById(id: string): Promise<AgenciasRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: AgenciasUpdate): Promise<AgenciasRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createAgenciasService(repository: AgenciasRepository) {
  return new AgenciasService(repository)
}
