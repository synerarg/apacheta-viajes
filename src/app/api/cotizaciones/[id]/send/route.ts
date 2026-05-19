import { NextResponse } from "next/server"

import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import { handleCotizadorError } from "@/lib/cotizaciones/errors"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const { id } = await context.params
    const controller = await createServerCotizacionesController()
    const cotizacion = await controller.markAsSent(id)
    return NextResponse.json({ cotizacion }, { status: 200 })
  } catch (error) {
    return handleCotizadorError(error)
  }
}
