import Link from "next/link"
import { notFound } from "next/navigation"
import { CaretLeft, Pencil } from "@phosphor-icons/react/dist/ssr"

import { QuoterPricesGrid } from "@/components/dashboard/quoter-prices-grid"
import { createServerQuoterCategoriesController } from "@/controllers/quoter-categories/quoter-categories.controller"
import { createServerQuoterPricesController } from "@/controllers/quoter-prices/quoter-prices.controller"
import { createServerQuoterServicesController } from "@/controllers/quoter-services/quoter-services.controller"

export const dynamic = "force-dynamic"

interface PreciosPageProps {
  params: Promise<{ serviceId: string }>
}

export default async function PreciosServicioPage({
  params,
}: PreciosPageProps) {
  const { serviceId } = await params

  const [
    servicesController,
    categoriesController,
    pricesController,
  ] = await Promise.all([
    createServerQuoterServicesController(),
    createServerQuoterCategoriesController(),
    createServerQuoterPricesController(),
  ])

  let servicio
  try {
    servicio = await servicesController.getById(serviceId)
  } catch {
    notFound()
  }

  if (!servicio) notFound()

  const [categorias, precios] = await Promise.all([
    categoriesController.list(),
    pricesController.list({ servicio_id: serviceId }),
  ])

  const categoria = servicio.categoria_id
    ? categorias.find((c) => c.id === servicio.categoria_id)
    : null

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <Link
          href="/dashboard/cotizador/catalogo/servicios"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a servicios
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {categoria?.nombre ?? "Sin categoría"}
            </p>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
              {servicio.nombre}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Precios por temporada. La comisión base del servicio es{" "}
              <strong>{servicio.comision_pct ?? 0}%</strong>. Podés sobrescribirla
              por temporada con el override.
            </p>
          </div>
          <Link
            href={`/dashboard/cotizador/catalogo/servicios/${servicio.id}/editar`}
            className="inline-flex items-center gap-2 border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <Pencil className="h-4 w-4" />
            Editar servicio
          </Link>
        </div>
      </div>

      <QuoterPricesGrid serviceId={servicio.id} precios={precios} />
    </div>
  )
}
