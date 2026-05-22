import {
  UsersNotFoundException,
  UsersServiceException,
} from "@/exceptions/users/users.exceptions"
import { UsersRepository } from "@/repositories/users/users.repository"
import { BaseService } from "@/services/base/base.service"
import type { UsersRow, UsersUpdate } from "@/types/users/users.types"

export class UsersService extends BaseService<"usuarios"> {
  constructor(repository: UsersRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new UsersServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new UsersNotFoundException(criteria)
  }

  async getById(id: string): Promise<UsersRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: UsersUpdate): Promise<UsersRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createUsersService(repository: UsersRepository) {
  return new UsersService(repository)
}
