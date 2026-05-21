import { NextResponse } from "next/server"

import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import {
  authorizeCotizacion,
  ensureEditable,
  isAuthFailure,
} from "@/lib/cotizaciones/authorize"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"
import { cotizacionHeaderSchema } from "@/lib/cotizaciones/schemas"

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const auth = await authorizeCotizacion(id)
    if (isAuthFailure(auth)) return auth

    const controller = await createServerCotizacionesController()
    const cotizacion = await controller.getWithItems(id)
    return NextResponse.json({ cotizacion }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const auth = await authorizeCotizacion(id)
    if (isAuthFailure(auth)) return auth

    const blocked = ensureEditable(auth.cotizacion)
    if (blocked) return blocked

    const body = await request.json()
    const payload = cotizacionHeaderSchema.parse(body)
    const controller = await createServerCotizacionesController()
    await controller.updateHeader(id, payload)
    const cotizacion = await controller.getWithItems(id)
    return NextResponse.json({ cotizacion }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const auth = await authorizeCotizacion(id)
    if (isAuthFailure(auth)) return auth

    const controller = await createServerCotizacionesController()
    await controller.deleteById(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
