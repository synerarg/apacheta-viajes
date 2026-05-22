import {
  OperatorTypesNotFoundException,
  OperatorTypesServiceException,
} from "@/exceptions/operator-types/operator-types.exceptions"
import { OperatorTypesRepository } from "@/repositories/operator-types/operator-types.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  OperatorTypesRow,
  OperatorTypesUpdate,
} from "@/types/operator-types/operator-types.types"

export class OperatorTypesService extends BaseService<"tipos_operador"> {
  constructor(private readonly typesRepository: OperatorTypesRepository) {
    super(typesRepository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OperatorTypesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OperatorTypesNotFoundException(criteria)
  }

  async getById(id: string): Promise<OperatorTypesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: OperatorTypesUpdate): Promise<OperatorTypesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }

  async listOrdered(): Promise<OperatorTypesRow[]> {
    try {
      return await this.typesRepository.listOrdered()
    } catch (error) {
      this.handleServiceError("listOrdered", error)
    }
  }

  async listActiveOrdered(): Promise<OperatorTypesRow[]> {
    try {
      return await this.typesRepository.listActiveOrdered()
    } catch (error) {
      this.handleServiceError("listActiveOrdered", error)
    }
  }
}

export function createOperatorTypesService(repository: OperatorTypesRepository) {
  return new OperatorTypesService(repository)
}
