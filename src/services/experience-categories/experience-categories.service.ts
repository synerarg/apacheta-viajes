import {
  CategoriasExperienciaNotFoundException,
  CategoriasExperienciaServiceException,
} from "@/exceptions/categorias-experiencia/categorias-experiencia.exceptions"
import { CategoriasExperienciaRepository } from "@/repositories/categorias-experiencia/categorias-experiencia.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  CategoriasExperienciaRow,
  CategoriasExperienciaUpdate,
} from "@/types/categorias-experiencia/categorias-experiencia.types"

export class CategoriasExperienciaService extends BaseService<"categorias_experiencia"> {
  constructor(repository: CategoriasExperienciaRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new CategoriasExperienciaServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new CategoriasExperienciaNotFoundException(criteria)
  }

  async getById(id: string): Promise<CategoriasExperienciaRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: CategoriasExperienciaUpdate,
  ): Promise<CategoriasExperienciaRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createCategoriasExperienciaService(
  repository: CategoriasExperienciaRepository,
) {
  return new CategoriasExperienciaService(repository)
}
