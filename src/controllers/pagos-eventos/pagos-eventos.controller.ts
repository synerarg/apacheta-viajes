import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPagosEventosRepository } from "@/repositories/pagos-eventos/pagos-eventos.repository"
import {
  createPagosEventosService,
  PagosEventosService,
} from "@/services/pagos-eventos/pagos-eventos.service"

export class PagosEventosController extends BaseIdController<"pagos_eventos"> {
  constructor(service: PagosEventosService) {
    super(service)
  }
}

export async function createServerPagosEventosController() {
  const supabase = await createClient()

  return new PagosEventosController(
    createPagosEventosService(createPagosEventosRepository(supabase)),
  )
}
