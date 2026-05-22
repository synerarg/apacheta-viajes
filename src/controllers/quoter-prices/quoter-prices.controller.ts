import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createQuoterPricesRepository } from "@/repositories/quoter-prices/quoter-prices.repository"
import {
  QuoterPricesService,
  createQuoterPricesService,
} from "@/services/quoter-prices/quoter-prices.service"

export class QuoterPricesController extends BaseIdController<
  "cotizador_servicio_precios",
  QuoterPricesService
> {
  constructor(service: QuoterPricesService) {
    super(service)
  }

  findByService(serviceId: string) {
    return this.service.findByService(serviceId)
  }

  findActiveForDate(serviceId: string, date: string) {
    return this.service.findActiveForDate(serviceId, date)
  }
}

export async function createServerQuoterPricesController() {
  const supabase = await createClient()
  return new QuoterPricesController(
    createQuoterPricesService(createQuoterPricesRepository(supabase)),
  )
}
