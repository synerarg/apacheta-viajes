import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerCheckoutController } from "@/controllers/checkout/checkout.controller"
import {
  CheckoutAuthenticationException,
  CheckoutServiceException,
  CheckoutValidationException,
} from "@/exceptions/checkout/checkout.exceptions"
import { createClient } from "@/lib/supabase/server"

const cartItemSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["paquete", "experiencia"]),
  category: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string(),
  moneda: z.enum(["ARS", "USD", "EUR", "BRL", "MXN", "CLP", "COP", "PEN", "UYU"]),
  paqueteFechaId: z.string().uuid().nullable(),
  experienciaId: z.string().uuid().nullable(),
})

const checkoutSubmitSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  paymentMethod: z.enum(["mercadopago", "transferencia", "efectivo"]),
  contact: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
  }),
  passenger: z.object({
    fullName: z.string().min(1),
    documentNumber: z.string().min(1),
    birthDate: z.string().min(1),
    nationality: z.string().min(1),
    specialRequirements: z.string(),
  }),
})

function getErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return "Invalid checkout payload"
  }

  if (error instanceof Error) {
    if (error.cause instanceof Error) {
      return getErrorMessage(error.cause)
    }

    return error.message
  }

  return "Checkout failed"
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = checkoutSubmitSchema.parse(body)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const checkoutController = await createServerCheckoutController()
    const result = await checkoutController.submitCheckout(
      payload,
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

    if (error instanceof CheckoutValidationException || error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: getErrorMessage(error),
        },
        { status: 400 },
      )
    }

    if (error instanceof CheckoutServiceException) {
      console.error("Checkout failed", error)

      return NextResponse.json(
        {
          error: getErrorMessage(error),
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        error: getErrorMessage(error),
      },
      { status: 500 },
    )
  }
}
