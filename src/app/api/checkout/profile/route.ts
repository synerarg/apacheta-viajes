import { NextResponse } from "next/server"

import { createServerCheckoutController } from "@/controllers/checkout/checkout.controller"
import { CheckoutAuthenticationException } from "@/exceptions/checkout/checkout.exceptions"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const checkoutController = await createServerCheckoutController()
    const result = await checkoutController.getSavedProfile(
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

    return NextResponse.json(
      {
        error: getUserFacingErrorMessage(
          error,
          "No se pudo cargar el perfil del checkout.",
        ),
      },
      { status: 500 },
    )
  }
}
