import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerCheckoutController } from "@/controllers/checkout/checkout.controller"
import { createServerPaymentsController } from "@/controllers/payments/payments.controller"
import {
  CheckoutAuthenticationException,
  CheckoutValidationException,
} from "@/exceptions/checkout/checkout.exceptions"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { createClient } from "@/lib/supabase/server"

const createBankTransferSchema = z.object({
  orderId: z.string().uuid(),
  payer: z
    .object({
      email: z.string().email().optional(),
      fullName: z.string().min(1).optional(),
      documentNumber: z.string().min(1).optional(),
    })
    .optional(),
  note: z.string().min(1).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = createBankTransferSchema.parse(body)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Necesitás iniciar sesión para continuar." },
        { status: 401 },
      )
    }

    const checkoutController = await createServerCheckoutController()
    await checkoutController.getOrderSummary(payload.orderId, {
      id: user.id,
      email: user.email ?? null,
    })

    const paymentsController = await createServerPaymentsController()
    const result = await paymentsController.createBankTransfer(payload)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof CheckoutAuthenticationException) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (error instanceof CheckoutValidationException) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      {
        error: getUserFacingErrorMessage(
          error,
          "No se pudo iniciar la transferencia bancaria.",
        ),
      },
      { status: 400 },
    )
  }
}
