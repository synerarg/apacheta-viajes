import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerCheckoutController } from "@/controllers/checkout/checkout.controller"
import {
  CheckoutAuthenticationException,
  CheckoutServiceException,
  CheckoutValidationException,
} from "@/exceptions/checkout/checkout.exceptions"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
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

const optionalNonEmptyString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value
  }

  const normalized = value.trim()

  return normalized.length > 0 ? normalized : undefined
}, z.string().min(1).optional())

const checkoutSubmitSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  paymentMethod: z.enum(["mercadopago", "transferencia"]),
  saveProfile: z.boolean(),
  contact: z.object({
    firstName: z.string().trim().min(1),
    lastName: optionalNonEmptyString,
    email: z.string().trim().email(),
    phone: z.string().trim().min(1),
  }),
  passenger: z.object({
    fullName: z.string().trim().min(1),
    documentNumber: z.string().trim().min(1),
    birthDate: optionalNonEmptyString,
    nationality: optionalNonEmptyString,
    specialRequirements: optionalNonEmptyString,
  }),
})

function getErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return "Los datos del checkout no son validos."
  }

  if (error instanceof Error) {
    if (error.cause instanceof Error) {
      return getErrorMessage(error.cause)
    }

    return getUserFacingErrorMessage(error, "No se pudo iniciar la reserva.")
  }

  return "No se pudo iniciar la reserva."
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
