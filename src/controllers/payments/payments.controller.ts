import { adminClient } from "@/lib/supabase/admin-client"
import { createClient } from "@/lib/supabase/server"
import { createPaymentsService, type PaymentsService } from "@/services/payments/payments.service"
import type {
  ConfirmBankTransferInput,
  CreateBankTransferPaymentInput,
  CreateMercadoPagoCheckoutProInput,
  CreatePaymentInput,
} from "@/types/payments/payments.types"
import type { DatabaseClient } from "@/types/database/database.types"

export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  async createPayment(input: CreatePaymentInput) {
    return this.paymentsService.createPayment(input)
  }

  async createMercadoPagoCheckoutPro(input: CreateMercadoPagoCheckoutProInput) {
    return this.paymentsService.mercadopagoCheckoutProService.createCheckoutPreference(
      input,
    )
  }

  async handleMercadoPagoWebhook(paymentId: string) {
    return this.paymentsService.mercadopagoCheckoutProService.handleWebhook(
      paymentId,
    )
  }

  async createBankTransfer(input: CreateBankTransferPaymentInput) {
    return this.paymentsService.bankTransferPaymentService.createInstructions(
      input,
    )
  }

  async confirmBankTransfer(input: ConfirmBankTransferInput) {
    return this.paymentsService.confirmBankTransfer(input.reservationId, {
      payer: input.payer,
      note: input.note,
      receiptReference: input.receiptReference,
    })
  }
}

export async function createServerPaymentsController() {
  const supabase = await createClient()

  return new PaymentsController(createPaymentsService(supabase))
}

export function createAdminPaymentsController() {
  return new PaymentsController(
    createPaymentsService(adminClient as DatabaseClient),
  )
}
