import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOperadoresRepository } from "@/repositories/operadores/operadores.repository"
import { OperadoresService, createOperadoresService } from "@/services/operadores/operadores.service"

export class OperadoresController extends BaseIdController<"operadores"> {
  constructor(service: OperadoresService) {
    super(service)
  }
}

export async function createServerOperadoresController() {
  const supabase = await createClient()

  return new OperadoresController(
    createOperadoresService(createOperadoresRepository(supabase)),
  )
}
