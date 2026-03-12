import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createAgenciasRepository } from "@/repositories/agencias/agencias.repository"
import { AgenciasService, createAgenciasService } from "@/services/agencias/agencias.service"

export class AgenciasController extends BaseIdController<"agencias"> {
  constructor(service: AgenciasService) {
    super(service)
  }
}

export async function createServerAgenciasController() {
  const supabase = await createClient()

  return new AgenciasController(
    createAgenciasService(createAgenciasRepository(supabase)),
  )
}
