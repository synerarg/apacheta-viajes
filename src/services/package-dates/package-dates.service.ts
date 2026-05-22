import {
  PackageDatesNotFoundException,
  PackageDatesServiceException,
} from "@/exceptions/package-dates/package-dates.exceptions"
import { PackageDatesRepository } from "@/repositories/package-dates/package-dates.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PackageDatesRow,
  PackageDatesUpdate,
} from "@/types/package-dates/package-dates.types"

export class PackageDatesService extends BaseService<"paquetes_fechas"> {
  constructor(repository: PackageDatesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PackageDatesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PackageDatesNotFoundException(criteria)
  }

  async getById(id: string): Promise<PackageDatesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: PackageDatesUpdate,
  ): Promise<PackageDatesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createPackageDatesService(
  repository: PackageDatesRepository,
) {
  return new PackageDatesService(repository)
}
