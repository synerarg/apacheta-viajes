import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import {
  authorizeCotizacion,
  isAuthFailure,
} from "@/lib/cotizaciones/authorize"
import { CotizacionesValidationException } from "@/exceptions/cotizaciones/cotizaciones.exceptions"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"

const bodySchema = z.object({
  estado: z.enum(["borrador", "archivada"]),
})

const ALLOWED_TRANSITIONS: Record<string, ReadonlyArray<"borrador" | "archivada">> = {
  borrador: ["archivada"],
  enviada: ["borrador", "archivada"],
  archivada: ["borrador"],
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const auth = await authorizeCotizacion(id)
    if (isAuthFailure(auth)) return auth

    const body = await request.json()
    const { estado } = bodySchema.parse(body)

    const allowed = ALLOWED_TRANSITIONS[auth.cotizacion.estado] ?? []
    if (!allowed.includes(estado)) {
      throw new CotizacionesValidationException(
        `Transición de "${auth.cotizacion.estado}" a "${estado}" no permitida.`,
      )
    }

    const controller = await createServerCotizacionesController()
    const cotizacion =
      estado === "archivada"
        ? await controller.archive(id)
        : await controller.reopenAsDraft(id)

    return NextResponse.json({ cotizacion }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
