import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createReservasRepository } from "@/repositories/reservas/reservas.repository"
import { createReservasService, ReservasService } from "@/services/reservas/reservas.service"

export class ReservasController extends BaseIdController<"reservas"> {
  constructor(service: ReservasService) {
    super(service)
  }
}

export async function createServerReservasController() {
  const supabase = await createClient()

  return new ReservasController(
    createReservasService(createReservasRepository(supabase)),
  )
}
