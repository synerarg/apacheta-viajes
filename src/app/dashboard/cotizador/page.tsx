import Link from "next/link"
import {
  Calculator,
  FolderSimple,
  ListChecks,
  Receipt,
} from "@phosphor-icons/react/dist/ssr"
import { ArrowRight } from "lucide-react"

import { StatsCard } from "@/components/dashboard/stats-card"
import { createServerCotizadorCategoriasController } from "@/controllers/cotizador-categorias/cotizador-categorias.controller"
import { createServerCotizadorServiciosController } from "@/controllers/cotizador-servicios/cotizador-servicios.controller"
import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"

export const dynamic = "force-dynamic"

export default async function DashboardCotizadorPage() {
  const [categoriasController, serviciosController, cotizacionesController] =
    await Promise.all([
      createServerCotizadorCategoriasController(),
      createServerCotizadorServiciosController(),
      createServerCotizacionesController(),
    ])

  const [categorias, servicios, cotizaciones] = await Promise.all([
    categoriasController.list(),
    serviciosController.list(),
    cotizacionesController.list(),
  ])

  const categoriasActivas = categorias.filter((c) => c.activo !== false).length
  const serviciosActivos = servicios.filter((s) => s.activo !== false).length

  const porEstado = {
    borrador: cotizaciones.filter((c) => c.estado === "borrador").length,
    enviada: cotizaciones.filter((c) => c.estado === "enviada").length,
    archivada: cotizaciones.filter((c) => c.estado === "archivada").length,
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
            Cotizador
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Gestioná el catálogo de servicios, precios y las cotizaciones
            generadas por los operadores.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/cotizador/catalogo"
            className="inline-flex items-center gap-2 border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            <FolderSimple className="h-4 w-4" />
            Catálogo
          </Link>
          <Link
            href="/dashboard/cotizador/cotizaciones"
            className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Receipt className="h-4 w-4" />
            Cotizaciones
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<FolderSimple className="h-6 w-6" />}
          label="Categorías activas"
          sublabel={`${categorias.length} totales`}
          value={categoriasActivas}
        />
        <StatsCard
          icon={<ListChecks className="h-6 w-6" />}
          label="Servicios activos"
          sublabel={`${servicios.length} totales`}
          value={serviciosActivos}
        />
        <StatsCard
          icon={<Receipt className="h-6 w-6" />}
          label="Cotizaciones"
          sublabel={`${porEstado.enviada} enviadas`}
          value={cotizaciones.length}
        />
        <StatsCard
          icon={<Calculator className="h-6 w-6" />}
          label="En borrador"
          sublabel={`${porEstado.archivada} archivadas`}
          value={porEstado.borrador}
        />
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-playfair text-lg font-semibold text-neutral-900">
              Catálogo
            </h2>
            <Link
              href="/dashboard/cotizador/catalogo"
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-primary"
            >
              Ver todo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-center justify-between">
              <span>Categorías</span>
              <span className="tabular-nums">{categorias.length}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Servicios</span>
              <span className="tabular-nums">{servicios.length}</span>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/dashboard/cotizador/catalogo/categorias/nueva"
              className="inline-flex items-center gap-1 border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50"
            >
              + Nueva categoría
            </Link>
            <Link
              href="/dashboard/cotizador/catalogo/servicios/nuevo"
              className="inline-flex items-center gap-1 border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50"
            >
              + Nuevo servicio
            </Link>
          </div>
        </div>

        <div className="border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-playfair text-lg font-semibold text-neutral-900">
              Cotizaciones por estado
            </h2>
            <Link
              href="/dashboard/cotizador/cotizaciones"
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-primary"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-center justify-between">
              <span>
                <span className="inline-block h-2 w-2 rounded-full bg-neutral-400 mr-2" />
                Borrador
              </span>
              <span className="tabular-nums">{porEstado.borrador}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                Enviadas
              </span>
              <span className="tabular-nums">{porEstado.enviada}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2" />
                Archivadas
              </span>
              <span className="tabular-nums">{porEstado.archivada}</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
