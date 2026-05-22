import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createQuoterServicesRepository } from "@/repositories/quoter-services/quoter-services.repository"
import {
  QuoterServicesService,
  createQuoterServicesService,
} from "@/services/quoter-services/quoter-services.service"

export class QuoterServicesController extends BaseIdController<
  "cotizador_servicios",
  QuoterServicesService
> {
  constructor(service: QuoterServicesService) {
    super(service)
  }

  findActiveByCategory(categoryId: string) {
    return this.service.findActiveByCategory(categoryId)
  }
}

export async function createServerQuoterServicesController() {
  const supabase = await createClient()
  return new QuoterServicesController(
    createQuoterServicesService(createQuoterServicesRepository(supabase)),
  )
}
