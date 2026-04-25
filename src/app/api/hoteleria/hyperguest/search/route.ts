import { NextResponse } from "next/server"
import { z } from "zod"

import { createAdminHyperGuestController } from "@/controllers/hyperguest/hyperguest.controller"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { createClient } from "@/lib/supabase/server"

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const providerPayloadSchema = z.record(z.string(), z.unknown()).optional()

const occupancyRoomSchema = z.object({
  adults: z.number().int().positive(),
  childrenAges: z.array(z.number().int().min(0).max(17)).optional(),
  infants: z.number().int().min(0).optional(),
})

const searchSchema = z.object({
  hotelId: z.string().uuid().optional(),
  propertyId: z.string().trim().min(1).optional(),
  checkIn: isoDateSchema,
  checkOut: isoDateSchema,
  rooms: z.number().int().positive().default(1),
  adults: z.number().int().positive().default(1),
  children: z.number().int().min(0).default(0),
  infants: z.number().int().min(0).default(0),
  occupancy: z.array(occupancyRoomSchema).min(1).optional(),
  currency: z.string().trim().min(3).max(3).optional(),
  nationality: z.string().trim().min(2).max(3).optional(),
  providerPayload: providerPayloadSchema,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = searchSchema.parse(body)
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const controller = createAdminHyperGuestController()
    const result = await controller.searchAvailability({
      ...payload,
      userId: user?.id ?? null,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("HyperGuest availability search failed", error)

    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? "Los datos de busqueda no son validos."
            : getUserFacingErrorMessage(
                error,
                "No se pudo consultar la disponibilidad.",
              ),
      },
      { status: error instanceof z.ZodError ? 400 : 500 },
    )
  }
}
