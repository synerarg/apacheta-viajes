import { NextResponse } from "next/server"

import { createServerQuotesController } from "@/controllers/quotes/quotes.controller"
import { handleQuoterError } from "@/lib/quotes/errors"
import { quoteHeaderSchema } from "@/lib/quotes/schemas"
import { createClient } from "@/lib/supabase/server"

async function getAuthContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { user: null, isAdmin: false, isOperador: false }
  const { data: profile } = await supabase
    .from("usuarios")
    .select("tipo")
    .eq("id", user.id)
    .maybeSingle()
  const tipo = (profile as { tipo?: string } | null)?.tipo
  return {
    user,
    isAdmin: tipo === "admin",
    isOperador: tipo === "operador" || tipo === "admin",
  }
}

export async function POST(request: Request) {
  try {
    const { user, isOperador } = await getAuthContext()
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    if (!isOperador) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

    const body = await request.json()
    const payload = quoteHeaderSchema.parse(body)
    const controller = await createServerQuotesController()
    const cotizacion = await controller.createDraft(user.id, payload)
    return NextResponse.json({ cotizacion }, { status: 201 })
  } catch (error) {
    return handleQuoterError(error)
  }
}

export async function GET(request: Request) {
  try {
    const { user, isAdmin } = await getAuthContext()
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const url = new URL(request.url)
    const todas = url.searchParams.get("todas") === "1"
    const controller = await createServerQuotesController()

    const cotizaciones =
      todas && isAdmin
        ? await controller.listAll()
        : await controller.listMine(user.id)
    return NextResponse.json({ cotizaciones }, { status: 200 })
  } catch (error) {
    return handleQuoterError(error)
  }
}
