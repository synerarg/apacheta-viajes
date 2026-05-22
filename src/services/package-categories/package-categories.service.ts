import {
  PackageCategoriesNotFoundException,
  PackageCategoriesServiceException,
} from "@/exceptions/package-categories/package-categories.exceptions"
import { PackageCategoriesRepository } from "@/repositories/package-categories/package-categories.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  PackageCategoriesRow,
  PackageCategoriesUpdate,
} from "@/types/package-categories/package-categories.types"

export class PackageCategoriesService extends BaseService<"paquetes_categorias"> {
  constructor(repository: PackageCategoriesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new PackageCategoriesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new PackageCategoriesNotFoundException(criteria)
  }

  async getByCompositeKey(
    packageId: string,
    categoryId: string,
  ): Promise<PackageCategoriesRow> {
    return this.getOrThrow(
      {
        paquete_id: packageId,
        categoria_id: categoryId,
      },
      `paquete_id ${packageId} + categoria_id ${categoryId}`,
    )
  }

  async updateByCompositeKey(
    packageId: string,
    categoryId: string,
    payload: PackageCategoriesUpdate,
  ): Promise<PackageCategoriesRow> {
    return this.updateByFilters(
      {
        paquete_id: packageId,
        categoria_id: categoryId,
      },
      payload,
      `paquete_id ${packageId} + categoria_id ${categoryId}`,
    )
  }

  async deleteByCompositeKey(
    packageId: string,
    categoryId: string,
  ): Promise<void> {
    return this.deleteByFilters({
      paquete_id: packageId,
      categoria_id: categoryId,
    })
  }
}

export function createPackageCategoriesService(
  repository: PackageCategoriesRepository,
) {
  return new PackageCategoriesService(repository)
}
