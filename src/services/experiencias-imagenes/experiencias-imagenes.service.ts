import {
  ExperienciasImagenesNotFoundException,
  ExperienciasImagenesServiceException,
} from "@/exceptions/experiencias-imagenes/experiencias-imagenes.exceptions"
import { ExperienciasImagenesRepository } from "@/repositories/experiencias-imagenes/experiencias-imagenes.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  ExperienciasImagenesRow,
  ExperienciasImagenesUpdate,
} from "@/types/experiencias-imagenes/experiencias-imagenes.types"

export class ExperienciasImagenesService extends BaseService<"experiencias_imagenes"> {
  constructor(repository: ExperienciasImagenesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new ExperienciasImagenesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new ExperienciasImagenesNotFoundException(criteria)
  }

  async getById(id: string): Promise<ExperienciasImagenesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: ExperienciasImagenesUpdate,
  ): Promise<ExperienciasImagenesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createExperienciasImagenesService(
  repository: ExperienciasImagenesRepository,
) {
  return new ExperienciasImagenesService(repository)
}
