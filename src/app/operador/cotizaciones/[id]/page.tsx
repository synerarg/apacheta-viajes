import { notFound, redirect } from "next/navigation"

import { QuoteBuilder } from "@/components/operator/quote-builder"
import { createClient } from "@/lib/supabase/server"
import { createServerOperatorsController } from "@/controllers/operators/operators.controller"
import { createServerQuotesController } from "@/controllers/quotes/quotes.controller"
import { createServerQuoterCategoriesController } from "@/controllers/quoter-categories/quoter-categories.controller"
import { createServerQuoterServicesController } from "@/controllers/quoter-services/quoter-services.controller"
import type { QuotesRow } from "@/types/quotes/quotes.types"
import type { QuoteItemsRow } from "@/types/quote-items/quote-items.types"
import type { QuoterCategoriesRow } from "@/types/quoter-categories/quoter-categories.types"
import type { QuoterServicesRow } from "@/types/quoter-services/quoter-services.types"

export const dynamic = "force-dynamic"

type WithItems = QuotesRow & { items: QuoteItemsRow[] }

export default async function QuoteEditPage({
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

  const quotesController = await createServerQuotesController()
  const categoriesController = await createServerQuoterCategoriesController()
  const servicesController = await createServerQuoterServicesController()

  let cotizacion: WithItems | null = null
  try {
    cotizacion = (await quotesController.getWithItems(id)) as WithItems
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

  const operatorsController = await createServerOperatorsController()

  const [categorias, servicios, operator] = await Promise.all([
    categoriesController.list({ activo: true }) as Promise<QuoterCategoriesRow[]>,
    servicesController.list({ activo: true }) as Promise<QuoterServicesRow[]>,
    operatorsController.findByUserIdWithTier(cotizacion.operador_id),
  ])

  const tierComisionPct = Number(operator?.tipo_operador?.comision_pct ?? 0)

  return (
    <QuoteBuilder
      cotizacion={cotizacion}
      items={cotizacion.items ?? []}
      categorias={categorias}
      servicios={servicios}
      tierComisionPct={tierComisionPct}
    />
  )
}
