import { NextResponse } from "next/server"

import { createServerCotizadorServiciosController } from "@/controllers/cotizador-servicios/cotizador-servicios.controller"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"
import { upsertServicioSchema } from "@/lib/cotizaciones/schemas"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const categoriaId = url.searchParams.get("categoria_id")
    const controller = await createServerCotizadorServiciosController()

    if (categoriaId) {
      const servicios = await controller.findActiveByCategoria(categoriaId)
      return NextResponse.json({ servicios }, { status: 200 })
    }
    const servicios = await controller.list()
    return NextResponse.json({ servicios }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = upsertServicioSchema.parse(body)
    const controller = await createServerCotizadorServiciosController()
    const servicio = await controller.create(payload as never)
    return NextResponse.json({ servicio }, { status: 201 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
