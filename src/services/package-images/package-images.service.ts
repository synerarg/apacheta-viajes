import {
  PackageImagesNotFoundException,
  PackageImagesServiceException,
} from "@/exceptions/package-images/package-images.exceptions"
import { PackageImagesRepository } from "@/repositories/package-images/package-images.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PackageImagesRow,
  PackageImagesUpdate,
} from "@/types/package-images/package-images.types"

export class PackageImagesService extends BaseService<"paquetes_imagenes"> {
  constructor(repository: PackageImagesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PackageImagesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PackageImagesNotFoundException(criteria)
  }

  async getById(id: string): Promise<PackageImagesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: PackageImagesUpdate,
  ): Promise<PackageImagesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createPackageImagesService(
  repository: PackageImagesRepository,
) {
  return new PackageImagesService(repository)
}
