import {
  PackagesNotFoundException,
  PackagesServiceException,
} from "@/exceptions/packages/packages.exceptions"
import { PackagesRepository } from "@/repositories/packages/packages.repository"
import { BaseService } from "@/services/base/base.service"
import type { PackagesRow, PackagesUpdate } from "@/types/packages/packages.types"

export class PackagesService extends BaseService<"paquetes"> {
  constructor(repository: PackagesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PackagesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PackagesNotFoundException(criteria)
  }

  async getById(id: string): Promise<PackagesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(id: string, payload: PackagesUpdate): Promise<PackagesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createPackagesService(repository: PackagesRepository) {
  return new PackagesService(repository)
}
