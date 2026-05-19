import { NextResponse } from "next/server"

import { createServerCotizadorCategoriasController } from "@/controllers/cotizador-categorias/cotizador-categorias.controller"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"
import { upsertCategoriaSchema } from "@/lib/cotizaciones/schemas"

export async function GET() {
  try {
    const controller = await createServerCotizadorCategoriasController()
    const categorias = await controller.list()
    return NextResponse.json({ categorias }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = upsertCategoriaSchema.parse(body)
    const controller = await createServerCotizadorCategoriasController()
    const categoria = await controller.create(payload as never)
    return NextResponse.json({ categoria }, { status: 201 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
