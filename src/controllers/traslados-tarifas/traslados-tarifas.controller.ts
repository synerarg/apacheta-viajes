import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createTrasladosTarifasRepository } from "@/repositories/traslados-tarifas/traslados-tarifas.repository"
import {
  createTrasladosTarifasService,
  TrasladosTarifasService,
} from "@/services/traslados-tarifas/traslados-tarifas.service"

export class TrasladosTarifasController extends BaseIdController<"traslados_tarifas"> {
  constructor(service: TrasladosTarifasService) {
    super(service)
  }
}

export async function createServerTrasladosTarifasController() {
  const supabase = await createClient()

  return new TrasladosTarifasController(
    createTrasladosTarifasService(createTrasladosTarifasRepository(supabase)),
  )
}
