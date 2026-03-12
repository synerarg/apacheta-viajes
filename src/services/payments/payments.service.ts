import { PaymentsServiceException } from "@/exceptions/payments/payments.exceptions"
import { createPaymentsRepository } from "@/repositories/payments/payments.repository"
import type {
  BankTransferConfirmationResult,
  CreateBankTransferPaymentInput,
  CreateMercadoPagoCheckoutProInput,
  BankTransferPaymentResult,
  CreatePaymentInput,
  MercadoPagoCheckoutProResult,
} from "@/types/payments/payments.types"
import type { DatabaseClient } from "@/types/database/database.types"

import { BankTransferPaymentService } from "@/services/payments/bank-transfer-payment.service"
import { MercadoPagoCheckoutProService } from "@/services/payments/mercadopago-checkout-pro.service"

export class PaymentsService {
  readonly mercadopagoCheckoutProService
  readonly bankTransferPaymentService

  constructor(supabase: DatabaseClient) {
    const paymentsRepository = createPaymentsRepository(supabase)

    this.mercadopagoCheckoutProService = new MercadoPagoCheckoutProService(
      paymentsRepository,
    )
    this.bankTransferPaymentService = new BankTransferPaymentService(
      paymentsRepository,
    )
  }

  async createPayment(
    input: CreatePaymentInput,
  ): Promise<MercadoPagoCheckoutProResult | BankTransferPaymentResult> {
    if (input.method === "mercadopago_checkout_pro") {
      return this.createMercadoPagoCheckoutPro(input)
    }

    if (input.method === "bank_transfer") {
      return this.createBankTransfer(input)
    }

    throw new PaymentsServiceException(
      "createPayment",
      new Error(`Unsupported payment method: ${String(input.method)}`),
    )
  }

  async createMercadoPagoCheckoutPro(
    input: CreateMercadoPagoCheckoutProInput,
  ): Promise<MercadoPagoCheckoutProResult> {
    return this.mercadopagoCheckoutProService.createCheckoutPreference(input)
  }

  async createBankTransfer(
    input: CreateBankTransferPaymentInput,
  ): Promise<BankTransferPaymentResult> {
    return this.bankTransferPaymentService.createInstructions(input)
  }

  async confirmBankTransfer(reservationId: string, input: {
    payer?: CreatePaymentInput["payer"]
    note?: string
    receiptReference?: string
  }): Promise<BankTransferConfirmationResult> {
    return this.bankTransferPaymentService.confirmTransfer({
      reservationId,
      payer: input.payer,
      note: input.note,
      receiptReference: input.receiptReference,
    })
  }
}

export function createPaymentsService(supabase: DatabaseClient) {
  return new PaymentsService(supabase)
}
