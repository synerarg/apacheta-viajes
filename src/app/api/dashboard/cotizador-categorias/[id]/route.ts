import { NextResponse } from "next/server"

import { createServerCotizadorCategoriasController } from "@/controllers/cotizador-categorias/cotizador-categorias.controller"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"
import { upsertCategoriaSchema } from "@/lib/cotizaciones/schemas"

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const controller = await createServerCotizadorCategoriasController()
    const categoria = await controller.getById(id)
    return NextResponse.json({ categoria }, { status: 200 })
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
    const payload = upsertCategoriaSchema.partial().parse(body)
    const controller = await createServerCotizadorCategoriasController()
    const categoria = await controller.updateById(id, payload as never)
    return NextResponse.json({ categoria }, { status: 200 })
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
    const controller = await createServerCotizadorCategoriasController()
    await controller.deleteById(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
