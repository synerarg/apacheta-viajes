import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createHotelsRepository } from "@/repositories/hotels/hotels.repository"
import { createHotelsService, HotelsService } from "@/services/hotels/hotels.service"

export class HotelsController extends BaseIdController<"hoteles"> {
  constructor(service: HotelsService) {
    super(service)
  }
}

export async function createServerHotelsController() {
  const supabase = await createClient()

  return new HotelsController(
    createHotelsService(createHotelsRepository(supabase)),
  )
}
