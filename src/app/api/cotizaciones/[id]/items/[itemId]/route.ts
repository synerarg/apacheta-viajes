import { NextResponse } from "next/server"

import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"
import { updateItemSchema } from "@/lib/cotizaciones/schemas"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { itemId } = await context.params
    const body = await request.json()
    const payload = updateItemSchema.parse(body)
    const controller = await createServerCotizacionesController()
    const item = await controller.updateItem(itemId, {
      adultos: payload.adultos,
      menores: payload.menores,
      precio_adulto_unit: payload.precio_adulto_unit,
      precio_menor_unit: payload.precio_menor_unit,
      comision_pct: payload.comision_pct,
      dia_offset: payload.dia_offset,
      fecha: payload.fecha ?? undefined,
      servicio_nombre: payload.servicio_nombre,
      servicio_descripcion: payload.servicio_descripcion,
    })
    return NextResponse.json({ item }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { itemId } = await context.params
    const controller = await createServerCotizacionesController()
    await controller.removeItem(itemId)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
