import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createReservationsRepository } from "@/repositories/reservations/reservations.repository"
import { createReservationsService, ReservationsService } from "@/services/reservations/reservations.service"

export class ReservationsController extends BaseIdController<"reservas"> {
  constructor(service: ReservationsService) {
    super(service)
  }
}

export async function createServerReservationsController() {
  const supabase = await createClient()

  return new ReservationsController(
    createReservationsService(createReservationsRepository(supabase)),
  )
}
