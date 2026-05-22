import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createTrasladosImagenesRepository } from "@/repositories/traslados-imagenes/traslados-imagenes.repository"
import {
  createTrasladosImagenesService,
  TrasladosImagenesService,
} from "@/services/traslados-imagenes/traslados-imagenes.service"

export class TrasladosImagenesController extends BaseIdController<"traslados_imagenes"> {
  constructor(service: TrasladosImagenesService) {
    super(service)
  }
}

export async function createServerTrasladosImagenesController() {
  const supabase = await createClient()

  return new TrasladosImagenesController(
    createTrasladosImagenesService(createTrasladosImagenesRepository(supabase)),
  )
}
