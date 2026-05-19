import { NextResponse } from "next/server"

import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"
import { cotizacionHeaderSchema } from "@/lib/cotizaciones/schemas"
import { createClient } from "@/lib/supabase/server"

async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { id } = await context.params
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
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { id } = await context.params
    const body = await request.json()
    const payload = cotizacionHeaderSchema.parse(body)
    const controller = await createServerCotizacionesController()
    const cotizacion = await controller.updateHeader(id, payload)
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
    const user = await requireAuth()
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { id } = await context.params
    const controller = await createServerCotizacionesController()
    await controller.deleteById(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
