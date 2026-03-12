import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createEmisivoDestinosRepository } from "@/repositories/emisivo-destinos/emisivo-destinos.repository"
import {
  createEmisivoDestinosService,
  EmisivoDestinosService,
} from "@/services/emisivo-destinos/emisivo-destinos.service"

export class EmisivoDestinosController extends BaseIdController<"emisivo_destinos"> {
  constructor(service: EmisivoDestinosService) {
    super(service)
  }
}

export async function createServerEmisivoDestinosController() {
  const supabase = await createClient()

  return new EmisivoDestinosController(
    createEmisivoDestinosService(
      createEmisivoDestinosRepository(supabase),
    ),
  )
}
