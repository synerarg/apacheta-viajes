import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createEstadisticasHomeRepository } from "@/repositories/estadisticas-home/estadisticas-home.repository"
import {
  createEstadisticasHomeService,
  EstadisticasHomeService,
} from "@/services/estadisticas-home/estadisticas-home.service"

export class EstadisticasHomeController extends BaseIdController<"estadisticas_home"> {
  constructor(service: EstadisticasHomeService) {
    super(service)
  }
}

export async function createServerEstadisticasHomeController() {
  const supabase = await createClient()

  return new EstadisticasHomeController(
    createEstadisticasHomeService(
      createEstadisticasHomeRepository(supabase),
    ),
  )
}
