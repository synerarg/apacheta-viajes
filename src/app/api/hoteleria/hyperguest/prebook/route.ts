import { NextResponse } from "next/server"
import { z } from "zod"

import { createAdminHyperGuestController } from "@/controllers/hyperguest/hyperguest.controller"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"

const providerPayloadSchema = z.record(z.string(), z.unknown()).optional()
const offerSchema = z.record(z.string(), z.unknown())

const prebookSchema = z.object({
  bookingIntentId: z.string().uuid(),
  selectedOffer: offerSchema.optional(),
  selectedOffers: z.array(offerSchema).min(1).optional(),
  providerPayload: providerPayloadSchema,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = prebookSchema.parse(body)
    const controller = createAdminHyperGuestController()
    const result = await controller.prebook(payload)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("HyperGuest prebook failed", error)

    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? "Los datos de pre-reserva no son validos."
            : getUserFacingErrorMessage(
                error,
                "No se pudo iniciar la pre-reserva.",
              ),
      },
      { status: error instanceof z.ZodError ? 400 : 500 },
    )
  }
}
