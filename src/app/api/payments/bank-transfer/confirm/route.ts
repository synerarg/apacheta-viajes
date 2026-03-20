import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerPaymentsController } from "@/controllers/payments/payments.controller"

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
    const body = await request.json()
    const payload = confirmBankTransferSchema.parse(body)
    const paymentsController = await createServerPaymentsController()
    const result = await paymentsController.confirmBankTransfer(payload)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Bank transfer confirmation failed",
      },
      { status: 400 },
    )
  }
}
