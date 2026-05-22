import { adminClient } from "@/lib/supabase/admin-client"
import { createPaymentsService, type PaymentsService } from "@/services/payments/payments.service"
import type {
  AuthorizeBankTransferReceiptUploadInput,
  ConfirmBankTransferInput,
  CreateBankTransferPaymentInput,
  CreateMercadoPagoCheckoutProInput,
  CreatePaymentInput,
  RegisterBankTransferReceiptInput,
  UploadBankTransferReceiptInput,
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
    return this.paymentsService.confirmBankTransfer({
      paymentId: input.paymentId,
      payer: input.payer,
      note: input.note,
      receiptReference: input.receiptReference,
    })
  }

  async uploadBankTransferReceipt(input: UploadBankTransferReceiptInput) {
    return this.paymentsService.uploadBankTransferReceipt(input)
  }

  async authorizeBankTransferReceiptUpload(
    input: AuthorizeBankTransferReceiptUploadInput,
  ) {
    return this.paymentsService.authorizeBankTransferReceiptUpload(input)
  }

  async registerBankTransferReceiptUpload(
    input: RegisterBankTransferReceiptInput,
  ) {
    return this.paymentsService.registerBankTransferReceiptUpload(input)
  }

  async getCheckoutOrderSummary(orderId: string) {
    return this.paymentsService.getCheckoutOrderSummary(orderId)
  }

  async getBankTransferReceiptDownloadUrl(paymentId: string, userId: string) {
    return this.paymentsService.getBankTransferReceiptDownloadUrl({
      paymentId,
      userId,
    })
  }

  async expireOpenBankTransfers(referenceDate?: string) {
    return this.paymentsService.expireOpenBankTransfers(referenceDate)
  }
}

export async function createServerPaymentsController() {
  return new PaymentsController(
    createPaymentsService(adminClient as DatabaseClient),
  )
}

export function createAdminPaymentsController() {
  return new PaymentsController(
    createPaymentsService(adminClient as DatabaseClient),
  )
}
