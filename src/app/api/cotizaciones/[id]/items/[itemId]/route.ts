import { NextResponse } from "next/server"

import { createServerQuotesController } from "@/controllers/quotes/quotes.controller"
import {
  authorizeQuote,
  ensureEditable,
  isAuthFailure,
} from "@/lib/quotes/authorize"
import { handleQuoterError } from "@/lib/quotes/errors"
import { updateItemSchema } from "@/lib/quotes/schemas"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id, itemId } = await context.params
    const auth = await authorizeQuote(id)
    if (isAuthFailure(auth)) return auth

    const blocked = ensureEditable(auth.cotizacion)
    if (blocked) return blocked

    const body = await request.json()
    const payload = updateItemSchema.parse(body)
    const controller = await createServerQuotesController()
    const item = await controller.updateItem(itemId, {
      adultos: payload.adultos,
      menores: payload.menores,
      precio_adulto_unit: payload.precio_adulto_unit,
      precio_menor_unit: payload.precio_menor_unit,
      dia_offset: payload.dia_offset,
      fecha: payload.fecha ?? undefined,
      servicio_nombre: payload.servicio_nombre,
      servicio_descripcion: payload.servicio_descripcion,
    })
    return NextResponse.json({ item }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id, itemId } = await context.params
    const auth = await authorizeQuote(id)
    if (isAuthFailure(auth)) return auth

    const blocked = ensureEditable(auth.cotizacion)
    if (blocked) return blocked

    const controller = await createServerQuotesController()
    await controller.removeItem(itemId)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
