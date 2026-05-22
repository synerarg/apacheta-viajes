import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createQuoterCategoriesRepository } from "@/repositories/quoter-categories/quoter-categories.repository"
import {
  QuoterCategoriesService,
  createQuoterCategoriesService,
} from "@/services/quoter-categories/quoter-categories.service"

export class QuoterCategoriesController extends BaseIdController<
  "cotizador_categorias",
  QuoterCategoriesService
> {
  constructor(service: QuoterCategoriesService) {
    super(service)
  }
}

export async function createServerQuoterCategoriesController() {
  const supabase = await createClient()
  return new QuoterCategoriesController(
    createQuoterCategoriesService(createQuoterCategoriesRepository(supabase)),
  )
}
