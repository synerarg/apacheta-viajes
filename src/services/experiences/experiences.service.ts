import {
  ExperienciasNotFoundException,
  ExperienciasServiceException,
} from "@/exceptions/experiencias/experiencias.exceptions"
import { ExperienciasRepository } from "@/repositories/experiencias/experiencias.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  ExperienciasRow,
  ExperienciasUpdate,
} from "@/types/experiencias/experiencias.types"

export class ExperienciasService extends BaseService<"experiencias"> {
  constructor(repository: ExperienciasRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new ExperienciasServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new ExperienciasNotFoundException(criteria)
  }

  async getById(id: string): Promise<ExperienciasRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: ExperienciasUpdate,
  ): Promise<ExperienciasRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createExperienciasService(repository: ExperienciasRepository) {
  return new ExperienciasService(repository)
}
