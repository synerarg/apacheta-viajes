import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createTrasladosRepository } from "@/repositories/traslados/traslados.repository"
import {
  createTrasladosService,
  TrasladosService,
} from "@/services/traslados/traslados.service"

export class TrasladosController extends BaseIdController<"traslados"> {
  constructor(service: TrasladosService) {
    super(service)
  }
}

export async function createServerTrasladosController() {
  const supabase = await createClient()

  return new TrasladosController(
    createTrasladosService(createTrasladosRepository(supabase)),
  )
}
