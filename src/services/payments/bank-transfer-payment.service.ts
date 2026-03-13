import { getBankTransferConfig } from "@/lib/payments/payments.config"
import type { PaymentsRepository } from "@/repositories/payments/payments.repository"
import type {
  BankTransferConfirmationResult,
  BankTransferPaymentResult,
  ConfirmBankTransferInput,
  CreateBankTransferPaymentInput,
} from "@/types/payments/payments.types"

function buildReference(reservationId: string) {
  return `RES-${reservationId.slice(0, 8).toUpperCase()}`
}

function buildBankTransferNote(input: {
  prefix: string
  reference: string
  payerFullName?: string | null
  payerEmail?: string | null
  documentNumber?: string | null
  receiptReference?: string | null
  note?: string | null
}) {
  return [
    input.prefix,
    `reference=${input.reference}`,
    input.payerFullName ? `payer_name=${input.payerFullName}` : null,
    input.payerEmail ? `payer_email=${input.payerEmail}` : null,
    input.documentNumber ? `payer_document=${input.documentNumber}` : null,
    input.receiptReference ? `receipt_reference=${input.receiptReference}` : null,
    input.note ? `note=${input.note}` : null,
  ]
    .filter(Boolean)
    .join(" | ")
}

export class BankTransferPaymentService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async createInstructions(
    input: CreateBankTransferPaymentInput,
  ): Promise<BankTransferPaymentResult> {
    const { reservation } =
      await this.paymentsRepository.getReservationContext(input.reservationId)
    const config = getBankTransferConfig()
    const expiresAt = new Date(
      Date.now() + config.paymentWindowHours * 60 * 60 * 1000,
    ).toISOString()
    const reference = buildReference(reservation.id)

    await this.paymentsRepository.appendReservationNote(
      reservation.id,
      buildBankTransferNote({
        prefix: "Transferencia iniciada",
        reference,
        payerFullName: input.payer?.fullName ?? null,
        payerEmail: input.payer?.email ?? null,
        documentNumber: input.payer?.documentNumber ?? null,
        note: input.note ?? null,
      }),
    )

    return {
      provider: "bank_transfer",
      reservationId: reservation.id,
      amount: Number(reservation.precio_total),
      currency: reservation.moneda ?? "ARS",
      expiresAt,
      reference,
      status: reservation.estado ?? "pendiente",
      bankDetails: {
        bankName: config.bankName,
        accountHolder: config.accountHolder,
        alias: config.alias,
        cbu: config.cbu,
        receiptEmail: config.receiptEmail,
      },
      instructions: [
        "Transfiere el monto exacto usando los datos bancarios informados.",
        `Usa la referencia ${reference} en el concepto o detalle de la transferencia.`,
        "Conserva el comprobante para enviarlo o validarlo desde el checkout cuando conectemos el frontend.",
      ],
    }
  }

  async confirmTransfer(
    input: ConfirmBankTransferInput,
  ): Promise<BankTransferConfirmationResult> {
    const reference = buildReference(input.reservationId)

    await this.paymentsRepository.updateReservationStatus(
      input.reservationId,
      "confirmada",
      buildBankTransferNote({
        prefix: "Transferencia reportada por cliente",
        reference,
        payerFullName: input.payer?.fullName ?? null,
        payerEmail: input.payer?.email ?? null,
        documentNumber: input.payer?.documentNumber ?? null,
        receiptReference: input.receiptReference ?? null,
        note: input.note ?? null,
      }),
    )

    return {
      reservationId: input.reservationId,
      status: "confirmada",
      confirmedAt: new Date().toISOString(),
      reference,
    }
  }
}
