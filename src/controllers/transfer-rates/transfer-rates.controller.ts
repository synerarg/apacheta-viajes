import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createTransferRatesRepository } from "@/repositories/transfer-rates/transfer-rates.repository"
import {
  createTransferRatesService,
  TransferRatesService,
} from "@/services/transfer-rates/transfer-rates.service"

export class TransferRatesController extends BaseIdController<"traslados_tarifas"> {
  constructor(service: TransferRatesService) {
    super(service)
  }
}

export async function createServerTransferRatesController() {
  const supabase = await createClient()

  return new TransferRatesController(
    createTransferRatesService(createTransferRatesRepository(supabase)),
  )
}
