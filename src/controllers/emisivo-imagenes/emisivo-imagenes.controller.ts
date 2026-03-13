import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createEmisivoImagenesRepository } from "@/repositories/emisivo-imagenes/emisivo-imagenes.repository"
import {
  createEmisivoImagenesService,
  EmisivoImagenesService,
} from "@/services/emisivo-imagenes/emisivo-imagenes.service"

export class EmisivoImagenesController extends BaseIdController<"emisivo_imagenes"> {
  constructor(service: EmisivoImagenesService) {
    super(service)
  }
}

export async function createServerEmisivoImagenesController() {
  const supabase = await createClient()

  return new EmisivoImagenesController(
    createEmisivoImagenesService(
      createEmisivoImagenesRepository(supabase),
    ),
  )
}
