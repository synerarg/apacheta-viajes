import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPaquetesFechasRepository } from "@/repositories/paquetes-fechas/paquetes-fechas.repository"
import {
  createPaquetesFechasService,
  PaquetesFechasService,
} from "@/services/paquetes-fechas/paquetes-fechas.service"

export class PaquetesFechasController extends BaseIdController<"paquetes_fechas"> {
  constructor(service: PaquetesFechasService) {
    super(service)
  }
}

export async function createServerPaquetesFechasController() {
  const supabase = await createClient()

  return new PaquetesFechasController(
    createPaquetesFechasService(createPaquetesFechasRepository(supabase)),
  )
}
