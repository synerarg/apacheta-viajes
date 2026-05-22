import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPaymentsRepository } from "@/repositories/payments/payments.repository"
import { createPaymentsService, PaymentsService } from "@/services/payments/payments.service"

export class PaymentsController extends BaseIdController<"pagos"> {
  constructor(service: PaymentsService) {
    super(service)
  }
}

export async function createServerPaymentsController() {
  const supabase = await createClient()

  return new PaymentsController(
    createPaymentsService(createPaymentsRepository(supabase)),
  )
}
