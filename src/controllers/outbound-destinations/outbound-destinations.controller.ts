import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOutboundDestinationsRepository } from "@/repositories/outbound-destinations/outbound-destinations.repository"
import {
  createOutboundDestinationsService,
  OutboundDestinationsService,
} from "@/services/outbound-destinations/outbound-destinations.service"

export class OutboundDestinationsController extends BaseIdController<"emisivo_destinos"> {
  constructor(service: OutboundDestinationsService) {
    super(service)
  }
}

export async function createServerOutboundDestinationsController() {
  const supabase = await createClient()

  return new OutboundDestinationsController(
    createOutboundDestinationsService(
      createOutboundDestinationsRepository(supabase),
    ),
  )
}
