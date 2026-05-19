import { NextResponse } from "next/server"

import { createServerCotizadorPreciosController } from "@/controllers/cotizador-precios/cotizador-precios.controller"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"
import { upsertPrecioSchema } from "@/lib/cotizaciones/schemas"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const servicioId = url.searchParams.get("servicio_id")
    const controller = await createServerCotizadorPreciosController()
    if (servicioId) {
      const precios = await controller.findByServicio(servicioId)
      return NextResponse.json({ precios }, { status: 200 })
    }
    const precios = await controller.list()
    return NextResponse.json({ precios }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = upsertPrecioSchema.parse(body)
    const controller = await createServerCotizadorPreciosController()
    const precio = await controller.create(payload as never)
    return NextResponse.json({ precio }, { status: 201 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
