import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerPaymentsController } from "@/controllers/payments/payments.controller"

const createMercadoPagoCheckoutProSchema = z.object({
  orderId: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  payer: z
    .object({
      email: z.string().email().optional(),
      fullName: z.string().min(1).optional(),
      documentNumber: z.string().min(1).optional(),
    })
    .optional(),
  successPath: z.string().startsWith("/").optional(),
  failurePath: z.string().startsWith("/").optional(),
  pendingPath: z.string().startsWith("/").optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = createMercadoPagoCheckoutProSchema.parse(body)
    const paymentsController = await createServerPaymentsController()
    const result = await paymentsController.createMercadoPagoCheckoutPro(payload)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Checkout Pro failed",
      },
      { status: 400 },
    )
  }
}
