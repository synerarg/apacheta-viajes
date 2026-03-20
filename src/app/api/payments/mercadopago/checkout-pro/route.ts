import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerCheckoutController } from "@/controllers/checkout/checkout.controller"
import { createServerPaymentsController } from "@/controllers/payments/payments.controller"
import { CheckoutAuthenticationException, CheckoutValidationException } from "@/exceptions/checkout/checkout.exceptions"
import { createClient } from "@/lib/supabase/server"

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
    const result = await paymentsController.createMercadoPagoCheckoutPro(payload)

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
        error: error instanceof Error ? error.message : "Checkout Pro failed",
      },
      { status: 400 },
    )
  }
}
