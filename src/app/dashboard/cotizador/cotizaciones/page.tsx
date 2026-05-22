import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { QuotesAdminTable } from "@/components/dashboard/quotes-admin-table"
import { createServerQuotesController } from "@/controllers/quotes/quotes.controller"
import { createServerOperatorsController } from "@/controllers/operators/operators.controller"

export const dynamic = "force-dynamic"

export default async function QuotesPage() {
  const [quotesController, operatorsController] = await Promise.all([
    createServerQuotesController(),
    createServerOperatorsController(),
  ])

  const [cotizaciones, operadores] = await Promise.all([
    quotesController.list(),
    operatorsController.list(),
  ])

  const sorted = [...cotizaciones].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  const operatorsMini = operadores.map((o) => ({
    id: o.id,
    usuario_id: o.usuario_id,
    nombre_comercial: o.nombre_comercial,
    nombre: o.nombre,
  }))

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <Link
          href="/dashboard/cotizador"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver al cotizador
        </Link>
        <h1 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900">
          Cotizaciones
        </h1>
        <p className="mt-1 text-sm sm:text-base text-neutral-500">
          Todas las cotizaciones generadas por los operadores.
        </p>
      </div>

      <QuotesAdminTable
        cotizaciones={sorted}
        operadores={operatorsMini}
      />
    </div>
  )
}
