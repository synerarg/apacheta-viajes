import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPagosRepository } from "@/repositories/pagos/pagos.repository"
import { createPagosService, PagosService } from "@/services/pagos/pagos.service"

export class PagosController extends BaseIdController<"pagos"> {
  constructor(service: PagosService) {
    super(service)
  }
}

export async function createServerPagosController() {
  const supabase = await createClient()

  return new PagosController(
    createPagosService(createPagosRepository(supabase)),
  )
}
