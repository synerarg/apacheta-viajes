import { notFound, redirect } from "next/navigation"

import { CotizadorBuilder } from "@/components/operador/cotizador-builder"
import { createClient } from "@/lib/supabase/server"
import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import { createServerCotizadorCategoriasController } from "@/controllers/cotizador-categorias/cotizador-categorias.controller"
import { createServerCotizadorServiciosController } from "@/controllers/cotizador-servicios/cotizador-servicios.controller"
import type { CotizacionesRow } from "@/types/cotizaciones/cotizaciones.types"
import type { CotizacionesItemsRow } from "@/types/cotizaciones-items/cotizaciones-items.types"
import type { CotizadorCategoriasRow } from "@/types/cotizador-categorias/cotizador-categorias.types"
import type { CotizadorServiciosRow } from "@/types/cotizador-servicios/cotizador-servicios.types"

export const dynamic = "force-dynamic"

type WithItems = CotizacionesRow & { items: CotizacionesItemsRow[] }

export default async function CotizacionEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?next=/operador/cotizaciones/${id}`)
  }

  const cotizacionesController = await createServerCotizacionesController()
  const categoriasController = await createServerCotizadorCategoriasController()
  const serviciosController = await createServerCotizadorServiciosController()

  let cotizacion: WithItems | null = null
  try {
    cotizacion = (await cotizacionesController.getWithItems(id)) as WithItems
  } catch {
    cotizacion = null
  }

  if (!cotizacion) {
    notFound()
  }

  // Authorize: only the operator who owns it (or admin) can edit
  if (cotizacion.operador_id !== user.id) {
    const { data: profile } = await supabase
      .from("usuarios")
      .select("tipo")
      .eq("id", user.id)
      .maybeSingle()
    if (profile?.tipo !== "admin") {
      notFound()
    }
  }

  const [categorias, servicios] = await Promise.all([
    categoriasController.list({ activo: true }) as Promise<CotizadorCategoriasRow[]>,
    serviciosController.list({ activo: true }) as Promise<CotizadorServiciosRow[]>,
  ])

  return (
    <CotizadorBuilder
      cotizacion={cotizacion}
      items={cotizacion.items ?? []}
      categorias={categorias}
      servicios={servicios}
    />
  )
}
