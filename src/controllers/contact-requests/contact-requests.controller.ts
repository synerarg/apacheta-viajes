import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createSolicitudesContactoRepository } from "@/repositories/solicitudes-contacto/solicitudes-contacto.repository"
import {
  createSolicitudesContactoService,
  SolicitudesContactoService,
} from "@/services/solicitudes-contacto/solicitudes-contacto.service"

export class SolicitudesContactoController extends BaseIdController<"solicitudes_contacto"> {
  constructor(service: SolicitudesContactoService) {
    super(service)
  }
}

export async function createServerSolicitudesContactoController() {
  const supabase = await createClient()

  return new SolicitudesContactoController(
    createSolicitudesContactoService(
      createSolicitudesContactoRepository(supabase),
    ),
  )
}
