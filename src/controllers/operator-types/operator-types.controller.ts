import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createOperatorTypesRepository } from "@/repositories/operator-types/operator-types.repository"
import {
  OperatorTypesService,
  createOperatorTypesService,
} from "@/services/operator-types/operator-types.service"

export class OperatorTypesController extends BaseIdController<
  "tipos_operador",
  OperatorTypesService
> {
  constructor(service: OperatorTypesService) {
    super(service)
  }

  listOrdered() {
    return this.service.listOrdered()
  }

  listActiveOrdered() {
    return this.service.listActiveOrdered()
  }
}

export async function createServerOperatorTypesController() {
  const supabase = await createClient()
  return new OperatorTypesController(
    createOperatorTypesService(createOperatorTypesRepository(supabase)),
  )
}
