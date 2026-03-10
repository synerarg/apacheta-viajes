import { BaseException } from "@/exceptions/base/base.exception"
import { NotFoundException } from "@/exceptions/base/not-found.exception"
import type { BaseRepository } from "@/repositories/base/base.repository"
import type {
  PublicTableName,
  TableFilters,
  TableInsert,
  TableRow,
  TableUpdate,
} from "@/types/database/database.types"

export abstract class BaseService<TTableName extends PublicTableName> {
  protected constructor(
    protected readonly repository: BaseRepository<TTableName>,
  ) {}

  protected abstract createServiceException(
    operation: string,
    cause?: unknown,
  ): Error

  protected abstract createNotFoundException(criteria: string): Error

  protected handleServiceError(operation: string, cause: unknown): never {
    if (cause instanceof NotFoundException) {
      throw cause
    }

    if (cause instanceof BaseException) {
      throw this.createServiceException(operation, cause)
    }

    throw this.createServiceException(operation, cause)
  }

  async list(filters?: TableFilters<TTableName>): Promise<TableRow<TTableName>[]> {
    try {
      if (!filters || Object.keys(filters).length === 0) {
        return await this.repository.findAll()
      }

      return await this.repository.findMany(filters)
    } catch (error) {
      this.handleServiceError("list", error)
    }
  }

  async get(
    filters: TableFilters<TTableName>,
  ): Promise<TableRow<TTableName> | null> {
    try {
      return await this.repository.findOne(filters)
    } catch (error) {
      this.handleServiceError("get", error)
    }
  }

  async getOrThrow(
    filters: TableFilters<TTableName>,
    criteria: string,
  ): Promise<TableRow<TTableName>> {
    try {
      const record = await this.repository.findOne(filters)

      if (!record) {
        throw this.createNotFoundException(criteria)
      }

      return record
    } catch (error) {
      this.handleServiceError("getOrThrow", error)
    }
  }

  async create(payload: TableInsert<TTableName>): Promise<TableRow<TTableName>> {
    try {
      return await this.repository.create(payload)
    } catch (error) {
      this.handleServiceError("create", error)
    }
  }

  async updateByFilters(
    filters: TableFilters<TTableName>,
    payload: TableUpdate<TTableName>,
    criteria: string,
  ): Promise<TableRow<TTableName>> {
    try {
      const record = await this.repository.update(filters, payload)

      if (!record) {
        throw this.createNotFoundException(criteria)
      }

      return record
    } catch (error) {
      this.handleServiceError("updateByFilters", error)
    }
  }

  async deleteByFilters(filters: TableFilters<TTableName>): Promise<void> {
    try {
      await this.repository.delete(filters)
    } catch (error) {
      this.handleServiceError("deleteByFilters", error)
    }
  }
}
