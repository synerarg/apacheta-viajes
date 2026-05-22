import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOutboundImagesRepository } from "@/repositories/outbound-images/outbound-images.repository"
import {
  createOutboundImagesService,
  OutboundImagesService,
} from "@/services/outbound-images/outbound-images.service"

export class OutboundImagesController extends BaseIdController<"emisivo_imagenes"> {
  constructor(service: OutboundImagesService) {
    super(service)
  }
}

export async function createServerOutboundImagesController() {
  const supabase = await createClient()

  return new OutboundImagesController(
    createOutboundImagesService(
      createOutboundImagesRepository(supabase),
    ),
  )
}
