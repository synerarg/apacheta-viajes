import { NextResponse } from "next/server"

import { createServerCotizadorPreciosController } from "@/controllers/cotizador-precios/cotizador-precios.controller"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"
import { upsertPrecioSchema } from "@/lib/cotizaciones/schemas"

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const controller = await createServerCotizadorPreciosController()
    const precio = await controller.getById(id)
    return NextResponse.json({ precio }, { status: 200 })
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
    const body = await request.json()
    const payload = upsertPrecioSchema.partial().parse(body)
    const controller = await createServerCotizadorPreciosController()
    const precio = await controller.updateById(id, payload as never)
    return NextResponse.json({ precio }, { status: 200 })
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
    const controller = await createServerCotizadorPreciosController()
    await controller.deleteById(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
