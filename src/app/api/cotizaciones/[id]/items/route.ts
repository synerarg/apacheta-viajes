import { NextResponse } from "next/server"

import { createServerQuotesController } from "@/controllers/quotes/quotes.controller"
import {
  authorizeQuote,
  ensureEditable,
  isAuthFailure,
} from "@/lib/quotes/authorize"
import { handleQuoterError } from "@/lib/quotes/errors"
import { addItemRequestSchema } from "@/lib/quotes/schemas"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const auth = await authorizeQuote(id)
    if (isAuthFailure(auth)) return auth

    const blocked = ensureEditable(auth.cotizacion)
    if (blocked) return blocked

    const body = await request.json()
    const parsed = addItemRequestSchema.parse(body)
    const controller = await createServerQuotesController()

    if (parsed.type === "service") {
      const item = await controller.addItem(id, {
        servicio_id: parsed.servicio_id,
        dia_offset: parsed.dia_offset,
        fecha: parsed.fecha ?? null,
        adultos: parsed.adultos,
        menores: parsed.menores,
        precio_adulto_unit: parsed.precio_adulto_unit,
        precio_menor_unit: parsed.precio_menor_unit,
        temporada: parsed.temporada,
      })
      return NextResponse.json({ item }, { status: 201 })
    }

    const item = await controller.addSpecialItem(id, {
      nombre: parsed.nombre,
      descripcion: parsed.descripcion ?? null,
      precio_unit: parsed.precio_unit,
      adultos: parsed.adultos,
      menores: parsed.menores,
      dia_offset: parsed.dia_offset,
      fecha: parsed.fecha ?? null,
    })
    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
