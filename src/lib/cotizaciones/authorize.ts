import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import type { CotizacionesRow } from "@/types/cotizaciones/cotizaciones.types"
import type { DatabaseClient } from "@/types/database/database.types"

export type AuthorizedContext = {
  userId: string
  supabase: DatabaseClient
  isAdmin: boolean
}

export type AuthFailure = NextResponse

export async function requireAuthenticated(): Promise<AuthorizedContext | AuthFailure> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("usuarios")
    .select("tipo")
    .eq("id", user.id)
    .maybeSingle()

  return {
    userId: user.id,
    supabase: supabase as DatabaseClient,
    isAdmin: profile?.tipo === "admin",
  }
}

export async function authorizeCotizacion(
  cotizacionId: string,
): Promise<{ ctx: AuthorizedContext; cotizacion: CotizacionesRow } | AuthFailure> {
  const ctx = await requireAuthenticated()
  if (ctx instanceof NextResponse) return ctx

  const { data, error } = await ctx.supabase
    .from("cotizaciones")
    .select("*")
    .eq("id", cotizacionId)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json(
      { error: "Cotización no encontrada" },
      { status: 404 },
    )
  }

  const cotizacion = data as CotizacionesRow
  if (cotizacion.operador_id !== ctx.userId && !ctx.isAdmin) {
    return NextResponse.json(
      { error: "No tenés permisos para esta cotización" },
      { status: 403 },
    )
  }

  return { ctx, cotizacion }
}

export function ensureEditable(cotizacion: CotizacionesRow): NextResponse | null {
  if (cotizacion.estado !== "borrador") {
    return NextResponse.json(
      {
        error:
          "La cotización ya no está en borrador. Volvela a borrador para modificarla.",
      },
      { status: 409 },
    )
  }
  return null
}

export function isAuthFailure(value: unknown): value is NextResponse {
  return value instanceof NextResponse
}
