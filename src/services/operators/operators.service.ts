import {
  OperatorsNotFoundException,
  OperatorsServiceException,
} from "@/exceptions/operators/operators.exceptions"
import { OperatorsRepository } from "@/repositories/operators/operators.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  OperatorWithTier,
  OperatorsRow,
  OperatorsUpdate,
} from "@/types/operators/operators.types"

export class OperatorsService extends BaseService<"operadores"> {
  constructor(repository: OperatorsRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new OperatorsServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new OperatorsNotFoundException(criteria)
  }

  async getById(id: string): Promise<OperatorsRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async getByUserId(userId: string): Promise<OperatorsRow> {
    return this.getOrThrow({ usuario_id: userId }, `usuario_id ${userId}`)
  }

  async findByUserIdWithTier(
    userId: string,
  ): Promise<OperatorWithTier | null> {
    try {
      return await (this.repository as OperatorsRepository).findByUserIdWithTier(
        userId,
      )
    } catch (error) {
      this.handleServiceError("findByUserIdWithTier", error)
    }
  }

  async updateById(id: string, payload: OperatorsUpdate): Promise<OperatorsRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createOperatorsService(repository: OperatorsRepository) {
  return new OperatorsService(repository)
}
