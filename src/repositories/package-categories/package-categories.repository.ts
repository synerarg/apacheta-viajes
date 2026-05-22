import { PackageCategoriesRepositoryException } from "@/exceptions/package-categories/package-categories.exceptions"
import { BaseRepository } from "@/repositories/base/base.repository"
import type { DatabaseClient } from "@/types/database/database.types"
import type { PackageCategoriesUpdate } from "@/types/package-categories/package-categories.types"

export class PackageCategoriesRepository extends BaseRepository<"paquetes_categorias"> {
  constructor(supabase: DatabaseClient) {
    super(supabase, "paquetes_categorias")
  }

  protected createRepositoryException(operation: string, cause?: unknown) {
    return new PackageCategoriesRepositoryException(operation, cause)
  }

  async findByCompositeKey(packageId: string, categoryId: string) {
    return this.findOne({
      paquete_id: packageId,
      categoria_id: categoryId,
    })
  }

  async updateByCompositeKey(
    packageId: string,
    categoryId: string,
    payload: PackageCategoriesUpdate,
  ) {
    return this.update(
      {
        paquete_id: packageId,
        categoria_id: categoryId,
      },
      payload,
    )
  }

  async deleteByCompositeKey(packageId: string, categoryId: string) {
    return this.delete({
      paquete_id: packageId,
      categoria_id: categoryId,
    })
  }
}

export function createPackageCategoriesRepository(supabase: DatabaseClient) {
  return new PackageCategoriesRepository(supabase)
}
