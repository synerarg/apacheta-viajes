import { NextResponse } from "next/server"
import { z } from "zod"

import { createAdminHyperGuestController } from "@/controllers/hyperguest/hyperguest.controller"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { createClient } from "@/lib/supabase/server"

const providerPayloadSchema = z.record(z.string(), z.unknown()).optional()

const guestContactSchema = z.object({
  address: z.string().trim().min(1).nullable().optional(),
  city: z.string().trim().min(1).nullable().optional(),
  country: z.string().trim().length(2).nullable().optional(),
  email: z.string().trim().email().nullable().optional(),
  phone: z.string().trim().min(1).nullable().optional(),
  state: z.string().trim().min(1).nullable().optional(),
  zip: z.string().trim().min(1).nullable().optional(),
})

const titleSchema = z.enum(["MR", "MS", "MRS", "C"]).nullable().optional()

const guestSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  title: titleSchema,
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  contact: guestContactSchema.nullable().optional(),
})

const bookSchema = z.object({
  bookingIntentId: z.string().uuid(),
  guest: guestSchema.extend({
    email: z.string().trim().email(),
    phone: z.string().trim().min(1).nullable().optional(),
  }),
  roomGuests: z.array(z.array(guestSchema)).optional(),
  specialRequests: z.array(z.string().trim().min(1)).optional(),
  meta: z
    .array(z.object({ key: z.string().min(1), value: z.string() }))
    .optional(),
  providerPayload: providerPayloadSchema,
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Necesitas iniciar sesion para completar la reserva." },
        { status: 401 },
      )
    }

    const body = await request.json()
    const payload = bookSchema.parse(body)
    const controller = createAdminHyperGuestController()
    const result = await controller.book({
      ...payload,
      userId: user.id,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("HyperGuest booking failed", error)

    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? "Los datos de la reserva no son validos."
            : getUserFacingErrorMessage(
                error,
                "No se pudo confirmar la reserva.",
              ),
      },
      { status: error instanceof z.ZodError ? 400 : 500 },
    )
  }
}
