import { NextResponse } from "next/server"
import { z } from "zod"

import { createAdminPaymentsController } from "@/controllers/payments/payments.controller"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { requireAdminSession } from "@/lib/dashboard/admin-auth"

const confirmBankTransferSchema = z.object({
  paymentId: z.string().uuid(),
  payer: z
    .object({
      email: z.string().email().optional(),
      fullName: z.string().min(1).optional(),
      documentNumber: z.string().min(1).optional(),
    })
    .optional(),
  note: z.string().min(1).optional(),
  receiptReference: z.string().min(1).optional(),
})

export async function POST(request: Request) {
  try {
    await requireAdminSession()
    const body = await request.json()
    const payload = confirmBankTransferSchema.parse(body)
    const paymentsController = createAdminPaymentsController()
    const result = await paymentsController.confirmBankTransfer(payload)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    const status =
      error instanceof Error && error.message === "No autenticado"
        ? 401
        : error instanceof Error && error.message === "No autorizado"
          ? 403
          : 400

    return NextResponse.json(
      {
        error: getUserFacingErrorMessage(
          error,
          "No se pudo confirmar la transferencia bancaria.",
        ),
      },
      { status },
    )
  }
}
