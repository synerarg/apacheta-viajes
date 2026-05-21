import { NextResponse } from "next/server"

import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import {
  authorizeCotizacion,
  isAuthFailure,
} from "@/lib/cotizaciones/authorize"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const auth = await authorizeCotizacion(id)
    if (isAuthFailure(auth)) return auth

    const controller = await createServerCotizacionesController()
    const cotizacion = await controller.markAsSent(id)
    return NextResponse.json({ cotizacion }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
