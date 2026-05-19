import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createSolicitudesOperadorRepository } from "@/repositories/solicitudes-operador/solicitudes-operador.repository"
import {
  SolicitudesOperadorService,
  createSolicitudesOperadorService,
} from "@/services/solicitudes-operador/solicitudes-operador.service"

export class SolicitudesOperadorController extends BaseIdController<
  "solicitudes_operador",
  SolicitudesOperadorService
> {
  constructor(service: SolicitudesOperadorService) {
    super(service)
  }

  listMine(usuarioId: string) {
    return this.service.listMine(usuarioId)
  }

  getActiveByUsuarioId(usuarioId: string) {
    return this.service.getActiveByUsuarioId(usuarioId)
  }

  submit(usuarioId: string, payload: Parameters<SolicitudesOperadorService["submit"]>[1]) {
    return this.service.submit(usuarioId, payload)
  }

  cancel(solicitudId: string, usuarioId: string) {
    return this.service.cancel(solicitudId, usuarioId)
  }

  markInReview(solicitudId: string, adminId: string) {
    return this.service.markInReview(solicitudId, adminId)
  }

  approve(solicitudId: string, adminId: string) {
    return this.service.approve(solicitudId, adminId)
  }

  reject(solicitudId: string, adminId: string, motivo: string) {
    return this.service.reject(solicitudId, adminId, motivo)
  }
}

export async function createServerSolicitudesOperadorController() {
  const supabase = await createClient()

  return new SolicitudesOperadorController(
    createSolicitudesOperadorService(createSolicitudesOperadorRepository(supabase)),
  )
}
