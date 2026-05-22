import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createTransfersRepository } from "@/repositories/transfers/transfers.repository"
import {
  createTransfersService,
  TransfersService,
} from "@/services/transfers/transfers.service"

export class TransfersController extends BaseIdController<"traslados"> {
  constructor(service: TransfersService) {
    super(service)
  }
}

export async function createServerTransfersController() {
  const supabase = await createClient()

  return new TransfersController(
    createTransfersService(createTransfersRepository(supabase)),
  )
}
