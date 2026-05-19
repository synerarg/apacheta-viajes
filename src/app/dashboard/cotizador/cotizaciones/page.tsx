import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { CotizacionesAdminTable } from "@/components/dashboard/cotizaciones-admin-table"
import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import { createServerOperadoresController } from "@/controllers/operadores/operadores.controller"

export const dynamic = "force-dynamic"

export default async function CotizacionesPage() {
  const [cotizacionesController, operadoresController] = await Promise.all([
    createServerCotizacionesController(),
    createServerOperadoresController(),
  ])

  const [cotizaciones, operadores] = await Promise.all([
    cotizacionesController.list(),
    operadoresController.list(),
  ])

  const sorted = [...cotizaciones].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  const operadoresMini = operadores.map((o) => ({
    id: o.id,
    nombre_comercial: o.nombre_comercial,
    nombre: o.nombre,
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <Link
          href="/dashboard/cotizador"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver al cotizador
        </Link>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
          Cotizaciones
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Todas las cotizaciones generadas por los operadores.
        </p>
      </div>

      <CotizacionesAdminTable
        cotizaciones={sorted}
        operadores={operadoresMini}
      />
    </div>
  )
}
