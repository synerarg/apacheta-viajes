import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createDestinationsRepository } from "@/repositories/destinations/destinations.repository"
import { createDestinationsService, DestinationsService } from "@/services/destinations/destinations.service"

export class DestinationsController extends BaseIdController<"destinos"> {
  constructor(service: DestinationsService) {
    super(service)
  }
}

export async function createServerDestinationsController() {
  const supabase = await createClient()

  return new DestinationsController(
    createDestinationsService(createDestinationsRepository(supabase)),
  )
}
