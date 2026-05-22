import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPaymentEventsRepository } from "@/repositories/payment-events/payment-events.repository"
import {
  createPaymentEventsService,
  PaymentEventsService,
} from "@/services/payment-events/payment-events.service"

export class PaymentEventsController extends BaseIdController<"pagos_eventos"> {
  constructor(service: PaymentEventsService) {
    super(service)
  }
}

export async function createServerPaymentEventsController() {
  const supabase = await createClient()

  return new PaymentEventsController(
    createPaymentEventsService(createPaymentEventsRepository(supabase)),
  )
}
