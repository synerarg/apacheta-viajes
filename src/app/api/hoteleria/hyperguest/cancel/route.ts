import { NextResponse } from "next/server"
import { z } from "zod"

import { createAdminHyperGuestController } from "@/controllers/hyperguest/hyperguest.controller"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { createClient } from "@/lib/supabase/server"

const providerPayloadSchema = z.record(z.string(), z.unknown()).optional()

const cancelSchema = z.object({
  bookingIntentId: z.string().uuid(),
  providerBookingId: z.string().trim().min(1).optional(),
  reason: z.string().trim().min(1).nullable().optional(),
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
        { error: "Necesitas iniciar sesion para cancelar la reserva." },
        { status: 401 },
      )
    }

    const body = await request.json()
    const payload = cancelSchema.parse(body)
    const controller = createAdminHyperGuestController()
    const result = await controller.cancel({
      ...payload,
      userId: user.id,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("HyperGuest cancellation failed", error)

    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? "Los datos de cancelacion no son validos."
            : getUserFacingErrorMessage(error, "No se pudo cancelar la reserva."),
      },
      { status: error instanceof z.ZodError ? 400 : 500 },
    )
  }
}
