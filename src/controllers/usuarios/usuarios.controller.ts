import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createUsuariosRepository } from "@/repositories/usuarios/usuarios.repository"
import { createUsuariosService, UsuariosService } from "@/services/usuarios/usuarios.service"

export class UsuariosController extends BaseIdController<"usuarios"> {
  constructor(service: UsuariosService) {
    super(service)
  }
}

export async function createServerUsuariosController() {
  const supabase = await createClient()

  return new UsuariosController(
    createUsuariosService(createUsuariosRepository(supabase)),
  )
}
