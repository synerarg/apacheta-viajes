import { BaseController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPackageCategoriesRepository } from "@/repositories/package-categories/package-categories.repository"
import {
  createPackageCategoriesService,
  PackageCategoriesService,
} from "@/services/package-categories/package-categories.service"

export class PackageCategoriesController extends BaseController<
  "paquetes_categorias",
  PackageCategoriesService
> {
  constructor(service: PackageCategoriesService) {
    super(service)
  }

  async getByCompositeKey(packageId: string, categoryId: string) {
    return this.service.getByCompositeKey(packageId, categoryId)
  }

  async updateByCompositeKey(
    packageId: string,
    categoryId: string,
    payload: Parameters<PackageCategoriesService["updateByCompositeKey"]>[2],
  ) {
    return this.service.updateByCompositeKey(packageId, categoryId, payload)
  }

  async deleteByCompositeKey(packageId: string, categoryId: string) {
    return this.service.deleteByCompositeKey(packageId, categoryId)
  }
}

export async function createServerPackageCategoriesController() {
  const supabase = await createClient()

  return new PackageCategoriesController(
    createPackageCategoriesService(
      createPackageCategoriesRepository(supabase),
    ),
  )
}
