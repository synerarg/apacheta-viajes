import { NextResponse } from "next/server"

import { createServerCheckoutController } from "@/controllers/checkout/checkout.controller"
import { CheckoutAuthenticationException, CheckoutValidationException } from "@/exceptions/checkout/checkout.exceptions"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const checkoutController = await createServerCheckoutController()
    const result = await checkoutController.getOrderSummary(
      orderId,
      user
        ? {
            id: user.id,
            email: user.email ?? null,
          }
        : null,
    )

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof CheckoutAuthenticationException) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (error instanceof CheckoutValidationException) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load order",
      },
      { status: 500 },
    )
  }
}
