import {
  PaymentReceiptValidationException,
  PaymentsServiceException,
} from "@/exceptions/payments/payments.exceptions"
import { getBankTransferConfig } from "@/lib/payments/payments.config"
import type { PaymentsRepository } from "@/repositories/payments/payments.repository"
import type { TransactionalEmailService } from "@/services/notifications/transactional-email.service"
import type {
  BankTransferConfirmationResult,
  BankTransferPaymentResult,
  BankTransferReceiptUploadResult,
  ConfirmBankTransferInput,
  CreateBankTransferPaymentInput,
  UploadBankTransferReceiptInput,
} from "@/types/payments/payments.types"

const MIME_TYPE_TO_EXTENSIONS: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
}

function buildReference(orderCode: string) {
  return `ORD-${orderCode}`
}

function buildBankTransferInstructions(reference: string) {
  return [
    "Transferí el monto exacto usando los datos bancarios informados.",
    `Usá la referencia ${reference} en el detalle o concepto de la transferencia.`,
    "Subí el comprobante apenas realices la transferencia para que podamos validarla.",
  ]
}

function resolveFileExtension(fileName: string) {
  const sanitized = fileName.trim().toLowerCase()
  const lastDotIndex = sanitized.lastIndexOf(".")

  return lastDotIndex >= 0 ? sanitized.slice(lastDotIndex) : ""
}

function isPaymentExpired(expiresAt?: string | null) {
  if (!expiresAt) {
    return false
  }

  return Date.parse(expiresAt) <= Date.now()
}

export class BankTransferPaymentService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly transactionalEmailService?: TransactionalEmailService,
  ) {}

  private async notifyReceiptReported(paymentId: string) {
    if (!this.transactionalEmailService) {
      return
    }

    try {
      await this.transactionalEmailService.sendBankTransferReported(paymentId)
    } catch (error) {
      console.error("Failed to send bank transfer reported email", error)
    }
  }

  private async notifyPaymentApproved(paymentId: string) {
    if (!this.transactionalEmailService) {
      return
    }

    try {
      await this.transactionalEmailService.sendPaymentApproved(paymentId)
    } catch (error) {
      console.error("Failed to send payment approved email", error)
    }
  }

  async createInstructions(
    input: CreateBankTransferPaymentInput,
  ): Promise<BankTransferPaymentResult> {
    const { order } = await this.paymentsRepository.getOrderContext(input.orderId)
    const config = getBankTransferConfig()
    const expiresAt = new Date(
      Date.now() + config.paymentWindowMinutes * 60 * 1000,
    ).toISOString()
    const reference = buildReference(order.codigo_referencia)
    const payment = await this.paymentsRepository.createPayment({
      orden_id: order.id,
      metodo: "bank_transfer",
      proveedor: "bank_transfer",
      estado: "requires_action",
      monto: Number(order.total),
      moneda: order.moneda,
      external_reference: `BT-${crypto.randomUUID()}`,
      expires_at: expiresAt,
      receipt_reference: reference,
      metadata: {
        payerEmail: input.payer?.email ?? null,
        payerName: input.payer?.fullName ?? null,
      },
      updated_at: new Date().toISOString(),
    })

    await this.paymentsRepository.updateOrderById(order.id, {
      estado: "pago_pendiente",
      estado_pago: "requires_action",
      updated_at: new Date().toISOString(),
    })

    await this.paymentsRepository.createPaymentEvent({
      pago_id: payment.id,
      tipo: "bank_transfer.instructions_issued",
      estado: payment.estado,
      mensaje: `Transferencia iniciada. reference=${reference}`,
      payload: {
        payerEmail: input.payer?.email ?? null,
        payerName: input.payer?.fullName ?? null,
        note: input.note ?? null,
      },
    })

    return {
      provider: "bank_transfer",
      orderId: order.id,
      paymentId: payment.id,
      amount: Number(order.total),
      currency: order.moneda,
      expiresAt,
      reference,
      status: payment.estado,
      bankDetails: {
        bankName: config.bankName,
        accountHolder: config.accountHolder,
        taxId: config.taxId,
        alias: config.alias,
        cbu: config.cbu,
        receiptEmail: config.receiptEmail,
      },
      instructions: buildBankTransferInstructions(reference),
      receiptReference: payment.receipt_reference,
      hasReceipt: Boolean(payment.receipt_storage_path),
      receiptUrl: null,
    }
  }

  async uploadReceipt(
    input: UploadBankTransferReceiptInput,
  ): Promise<BankTransferReceiptUploadResult> {
    const payment = await this.paymentsRepository.getPaymentById(input.paymentId)
    const orderContext = await this.paymentsRepository.getOrderContext(payment.orden_id)

    if (orderContext.order.usuario_id !== input.userId) {
      throw new PaymentsServiceException(
        "uploadReceipt",
        new Error("Payment does not belong to the authenticated user"),
      )
    }

    const config = getBankTransferConfig()

    if (payment.metodo !== "bank_transfer") {
      throw new PaymentReceiptValidationException(
        "El comprobante sólo puede cargarse para pagos por transferencia.",
      )
    }

    if (isPaymentExpired(payment.expires_at)) {
      const expiredAt = new Date().toISOString()

      await this.paymentsRepository.updatePaymentById(payment.id, {
        estado: "expired",
        updated_at: expiredAt,
      })
      await this.paymentsRepository.updateOrderById(orderContext.order.id, {
        estado: "cancelada",
        estado_pago: "expired",
        updated_at: expiredAt,
      })
      await this.paymentsRepository.updateOrderReservationsStatus(
        orderContext.order.id,
        "cancelada",
        `Transferencia expirada antes de cargar comprobante. payment_id=${payment.id}`,
      )
      await this.paymentsRepository.createPaymentEvent({
        pago_id: payment.id,
        tipo: "bank_transfer.expired",
        estado: "expired",
        mensaje: "Transferencia expirada antes de recibir comprobante",
        payload: {
          expiredAt,
        },
      })

      throw new PaymentReceiptValidationException(
        "La ventana para informar esta transferencia ya venció.",
      )
    }

    if (
      payment.estado === "approved" ||
      payment.estado === "cancelled" ||
      payment.estado === "rejected" ||
      payment.estado === "expired"
    ) {
      throw new PaymentReceiptValidationException(
        "Este pago ya no admite nuevos comprobantes.",
      )
    }

    if (input.fileBuffer.byteLength === 0) {
      throw new PaymentReceiptValidationException(
        "El comprobante no puede estar vacío.",
      )
    }

    if (input.fileBuffer.byteLength > config.receiptMaxBytes) {
      throw new PaymentReceiptValidationException(
        "El comprobante excede el tamaño máximo permitido.",
      )
    }

    const allowedExtensions =
      MIME_TYPE_TO_EXTENSIONS[input.fileType]?.map((value) => value.toLowerCase()) ?? []
    const extension = resolveFileExtension(input.fileName)

    if (!config.allowedReceiptMimeTypes.includes(input.fileType)) {
      throw new PaymentReceiptValidationException(
        "El formato del comprobante no es válido.",
      )
    }

    if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
      throw new PaymentReceiptValidationException(
        "La extensión del archivo no coincide con el tipo de comprobante.",
      )
    }

    const previousUploads = (
      await this.paymentsRepository.listPaymentEvents(payment.id)
    ).filter((event) => event.tipo === "bank_transfer.receipt_uploaded").length

    if (previousUploads >= config.receiptMaxReuploads) {
      throw new PaymentReceiptValidationException(
        "Superaste la cantidad máxima de reintentos para este comprobante.",
      )
    }

    const upload = await this.paymentsRepository.uploadBankTransferReceipt({
      paymentId: payment.id,
      fileName: input.fileName,
      fileType: input.fileType,
      fileBuffer: input.fileBuffer,
    })
    const uploadedAt = new Date().toISOString()
    const nextStatus = "reported" as const

    await this.paymentsRepository.updatePaymentById(payment.id, {
      estado: nextStatus,
      receipt_storage_path: upload.receiptStoragePath,
      receipt_url: null,
      receipt_reference: input.receiptReference ?? payment.receipt_reference,
      updated_at: uploadedAt,
    })

    await this.paymentsRepository.updateOrderById(orderContext.order.id, {
      estado: "pago_reportado",
      estado_pago: nextStatus,
      updated_at: uploadedAt,
    })

    await this.paymentsRepository.updateOrderReservationsStatus(
      orderContext.order.id,
      "confirmada",
      `Comprobante de transferencia cargado. payment_id=${payment.id}`,
    )

    await this.paymentsRepository.createPaymentEvent({
      pago_id: payment.id,
      tipo: "bank_transfer.receipt_uploaded",
      estado: nextStatus,
      mensaje: "Comprobante de transferencia cargado por el cliente",
      payload: {
        note: input.note ?? null,
        receiptReference: input.receiptReference ?? null,
        reuploadNumber: previousUploads + 1,
      },
    })

    await this.notifyReceiptReported(payment.id)

    return {
      orderId: orderContext.order.id,
      paymentId: payment.id,
      status: nextStatus,
      receiptReference: input.receiptReference ?? payment.receipt_reference,
      hasReceipt: true,
      receiptUrl: null,
      uploadedAt,
    }
  }

  async confirmTransfer(
    input: ConfirmBankTransferInput,
  ): Promise<BankTransferConfirmationResult> {
    const payment = await this.paymentsRepository.getPaymentById(input.paymentId)
    const orderContext = await this.paymentsRepository.getOrderContext(payment.orden_id)

    if (isPaymentExpired(payment.expires_at) && payment.estado !== "approved") {
      throw new PaymentReceiptValidationException(
        "La ventana para aprobar esta transferencia ya venció.",
      )
    }

    const confirmedAt = new Date().toISOString()
    const reference =
      input.receiptReference ??
      payment.receipt_reference ??
      buildReference(orderContext.order.codigo_referencia)

    await this.paymentsRepository.updatePaymentById(payment.id, {
      estado: "approved",
      approved_at: confirmedAt,
      receipt_reference: reference,
      updated_at: confirmedAt,
    })

    await this.paymentsRepository.updateOrderById(orderContext.order.id, {
      estado: "pagada",
      estado_pago: "approved",
      updated_at: confirmedAt,
    })

    await this.paymentsRepository.updateOrderReservationsStatus(
      orderContext.order.id,
      "pagada",
      `Transferencia aprobada manualmente. payment_id=${payment.id}`,
    )

    await this.paymentsRepository.createPaymentEvent({
      pago_id: payment.id,
      tipo: "bank_transfer.confirmed",
      estado: "approved",
      mensaje: "Transferencia bancaria confirmada manualmente",
      payload: {
        note: input.note ?? null,
        receiptReference: reference,
      },
    })

    await this.notifyPaymentApproved(payment.id)

    return {
      orderId: orderContext.order.id,
      paymentId: payment.id,
      status: "approved",
      confirmedAt,
      reference,
    }
  }
}
