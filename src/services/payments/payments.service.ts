import {
  PaymentReceiptAccessDeniedException,
  PaymentReceiptUnavailableException,
  PaymentReceiptValidationException,
  PaymentsServiceException,
} from "@/exceptions/payments/payments.exceptions"
import { getBankTransferConfig } from "@/lib/payments/payments.config"
import { createPaymentsRepository } from "@/repositories/payments/payments.repository"
import type {
  AuthorizeBankTransferReceiptUploadInput,
  BankTransferConfirmationResult,
  BankTransferPaymentResult,
  BankTransferReceiptUploadAuthorizationResult,
  BankTransferReceiptUploadResult,
  CashLocalPaymentResult,
  CheckoutOrderSummary,
  OrderPaymentContext,
  CreateBankTransferPaymentInput,
  ExpireBankTransferPaymentsResult,
  CreateMercadoPagoCheckoutProInput,
  CreatePaymentInput,
  MercadoPagoCheckoutProResult,
  PaymentReceiptAccessInput,
  PaymentReceiptDownloadResult,
  RegisterBankTransferReceiptInput,
  UploadBankTransferReceiptInput,
} from "@/types/payments/payments.types"
import type { DatabaseClient } from "@/types/database/database.types"

import { BankTransferPaymentService } from "@/services/payments/bank-transfer-payment.service"
import { MercadoPagoCheckoutProService } from "@/services/payments/mercadopago-checkout-pro.service"
import { createTransactionalEmailService } from "@/services/notifications/transactional-email.service"

function mapOrderSummary(context: OrderPaymentContext): CheckoutOrderSummary {
  const payment = context.latestPayment
  const bankTransferConfig =
    payment?.metodo === "bank_transfer" ? getBankTransferConfig() : null
  const bankTransfer =
    payment?.metodo === "bank_transfer"
      ? {
          provider: "bank_transfer" as const,
          orderId: context.order.id,
          paymentId: payment.id,
          amount: Number(payment.monto),
          currency: payment.moneda,
          expiresAt: payment.expires_at ?? new Date().toISOString(),
          reference:
            payment.receipt_reference ?? `ORD-${context.order.codigo_referencia}`,
          status: payment.estado,
          bankDetails: {
            bankName: bankTransferConfig?.bankName ?? "",
            accountHolder: bankTransferConfig?.accountHolder ?? "",
            taxId: bankTransferConfig?.taxId ?? null,
            alias: bankTransferConfig?.alias ?? "",
            cbu: bankTransferConfig?.cbu ?? "",
            receiptEmail: bankTransferConfig?.receiptEmail ?? null,
          },
          instructions: [
            "Transferí el monto exacto usando los datos bancarios informados.",
            `Usá la referencia ${payment.receipt_reference ?? `ORD-${context.order.codigo_referencia}`}.`,
            "Subí el comprobante para que podamos validarlo.",
          ],
          receiptReference: payment.receipt_reference,
          hasReceipt: Boolean(payment.receipt_storage_path),
          receiptUrl: null,
        }
      : null

  return {
    orderId: context.order.id,
    reference: context.order.codigo_referencia,
    status: context.order.estado,
    paymentStatus: context.order.estado_pago,
    paymentMethod: context.order.metodo_pago,
    total: Number(context.order.total),
    currency: context.order.moneda,
    createdAt: context.order.created_at,
    items: context.items.map((item) => ({
      orderItemId: item.id,
      reservationId: item.reserva_id,
      kind: item.tipo,
      name: item.nombre,
      description: item.descripcion_corta ?? "",
      quantity: item.cantidad,
      unitPrice: Number(item.precio_unitario),
      totalPrice: Number(item.precio_total),
      currency: item.moneda,
      image: item.imagen_url ?? "",
    })),
    payment: payment
      ? {
          paymentId: payment.id,
          method: payment.metodo,
          provider: payment.proveedor,
          status: payment.estado,
          amount: Number(payment.monto),
          currency: payment.moneda,
          externalReference: payment.external_reference,
          redirectUrl: payment.redirect_url,
          expiresAt: payment.expires_at,
          receiptReference: payment.receipt_reference,
          hasReceipt: Boolean(payment.receipt_storage_path),
          receiptUrl: null,
        }
      : null,
    reservations: context.reservations.map((reservation) => ({
      reservationId: reservation.id,
      kind: reservation.tipo,
      status: reservation.estado,
      quantity: reservation.cantidad_pasajeros,
      unitPrice: Number(reservation.precio_unitario),
      totalPrice: Number(reservation.precio_total),
    })),
    bankTransfer,
  }
}

export class PaymentsService {
  readonly mercadopagoCheckoutProService
  readonly bankTransferPaymentService
  readonly paymentsRepository
  readonly transactionalEmailService

  constructor(supabase: DatabaseClient) {
    this.paymentsRepository = createPaymentsRepository(supabase)
    this.transactionalEmailService = createTransactionalEmailService(supabase)

    this.mercadopagoCheckoutProService = new MercadoPagoCheckoutProService(
      this.paymentsRepository,
      this.transactionalEmailService,
    )
    this.bankTransferPaymentService = new BankTransferPaymentService(
      this.paymentsRepository,
      this.transactionalEmailService,
    )
  }

  async createPayment(
    input: CreatePaymentInput,
  ): Promise<
    MercadoPagoCheckoutProResult | BankTransferPaymentResult | CashLocalPaymentResult
  > {
    if (input.method === "mercadopago_checkout_pro") {
      return this.createMercadoPagoCheckoutPro(input)
    }

    if (input.method === "bank_transfer") {
      return this.createBankTransfer(input)
    }

    if (input.method === "cash_local") {
      return this.createCashLocalPayment(input.orderId, input.note)
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

  async createCashLocalPayment(
    orderId: string,
    note?: string,
  ): Promise<CashLocalPaymentResult> {
    const context = await this.paymentsRepository.getOrderContext(orderId)
    const payment = await this.paymentsRepository.createPayment({
      orden_id: context.order.id,
      metodo: "cash_local",
      proveedor: "cash_local",
      estado: "requires_action",
      monto: Number(context.order.total),
      moneda: context.order.moneda,
      external_reference: `CASH-${crypto.randomUUID()}`,
      metadata: {
        note: note ?? null,
      },
      updated_at: new Date().toISOString(),
    })

    await this.paymentsRepository.updateOrderById(context.order.id, {
      estado: "pago_pendiente",
      estado_pago: "requires_action",
      updated_at: new Date().toISOString(),
    })

    await this.paymentsRepository.createPaymentEvent({
      pago_id: payment.id,
      tipo: "cash_local.created",
      estado: payment.estado,
      mensaje: "Pago en efectivo en sucursal registrado",
      payload: {
        note: note ?? null,
      },
    })

    return {
      provider: "cash_local",
      orderId: context.order.id,
      paymentId: payment.id,
      amount: Number(payment.monto),
      currency: payment.moneda,
      status: payment.estado,
    }
  }

  async confirmBankTransfer(
    input: {
      paymentId: string
      payer?: CreatePaymentInput["payer"]
      note?: string
      receiptReference?: string
    },
  ): Promise<BankTransferConfirmationResult> {
    return this.bankTransferPaymentService.confirmTransfer({
      paymentId: input.paymentId,
      payer: input.payer,
      note: input.note,
      receiptReference: input.receiptReference,
    })
  }

  async uploadBankTransferReceipt(
    input: UploadBankTransferReceiptInput,
  ): Promise<BankTransferReceiptUploadResult> {
    return this.bankTransferPaymentService.uploadReceipt(input)
  }

  async authorizeBankTransferReceiptUpload(
    input: AuthorizeBankTransferReceiptUploadInput,
  ): Promise<BankTransferReceiptUploadAuthorizationResult> {
    return this.bankTransferPaymentService.authorizeReceiptUpload(input)
  }

  async registerBankTransferReceiptUpload(
    input: RegisterBankTransferReceiptInput,
  ): Promise<BankTransferReceiptUploadResult> {
    return this.bankTransferPaymentService.registerUploadedReceipt(input)
  }

  async getCheckoutOrderSummary(orderId: string): Promise<CheckoutOrderSummary> {
    const context = await this.paymentsRepository.getOrderContext(orderId)

    return mapOrderSummary(context)
  }

  async listUserCheckoutOrders(userId: string): Promise<CheckoutOrderSummary[]> {
    const contexts = await this.paymentsRepository.listUserOrderContexts(userId)

    return contexts.map((context) => mapOrderSummary(context))
  }

  async getBankTransferReceiptDownloadUrl(
    input: PaymentReceiptAccessInput,
  ): Promise<PaymentReceiptDownloadResult> {
    const payment = await this.paymentsRepository.getPaymentById(input.paymentId)

    if (payment.metodo !== "bank_transfer") {
      throw new PaymentReceiptValidationException(
        "El comprobante sólo está disponible para pagos por transferencia.",
      )
    }

    if (!payment.receipt_storage_path) {
      throw new PaymentReceiptUnavailableException(`paymentId ${payment.id}`)
    }

    const [profile, orderContext] = await Promise.all([
      this.paymentsRepository.getUserProfile(input.userId),
      this.paymentsRepository.getOrderContext(payment.orden_id),
    ])
    const isOwner = orderContext.order.usuario_id === input.userId
    const isAdmin = profile?.tipo === "admin"

    if (!isOwner && !isAdmin) {
      throw new PaymentReceiptAccessDeniedException(
        "getBankTransferReceiptDownloadUrl",
        new Error("The authenticated user cannot access this receipt"),
      )
    }

    const config = getBankTransferConfig()
    const url = await this.paymentsRepository.createReceiptSignedUrl(
      payment.receipt_storage_path,
    )

    return {
      paymentId: payment.id,
      url,
      expiresInSeconds: config.receiptSignedUrlTtlSeconds,
    }
  }

  async expireOpenBankTransfers(
    referenceDate?: string,
  ): Promise<ExpireBankTransferPaymentsResult> {
    return this.bankTransferPaymentService.expireOpenTransfers(referenceDate)
  }
}

export function createPaymentsService(supabase: DatabaseClient) {
  return new PaymentsService(supabase)
}
