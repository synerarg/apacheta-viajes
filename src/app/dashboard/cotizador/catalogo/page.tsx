import Link from "next/link"
import { CaretLeft, Pencil } from "@phosphor-icons/react/dist/ssr"

import { DeleteQuoterItemButton } from "@/components/dashboard/delete-quoter-item-button"
import { createServerQuoterCategoriesController } from "@/controllers/quoter-categories/quoter-categories.controller"
import { createServerQuoterServicesController } from "@/controllers/quoter-services/quoter-services.controller"

export const dynamic = "force-dynamic"

export default async function CotizadorCatalogoPage() {
  const [categoriesController, servicesController] = await Promise.all([
    createServerQuoterCategoriesController(),
    createServerQuoterServicesController(),
  ])

  const [categorias, servicios] = await Promise.all([
    categoriesController.list(),
    servicesController.list(),
  ])

  const serviciosPorCategoria = new Map<string, number>()
  servicios.forEach((servicio) => {
    if (servicio.categoria_id) {
      serviciosPorCategoria.set(
        servicio.categoria_id,
        (serviciosPorCategoria.get(servicio.categoria_id) ?? 0) + 1,
      )
    }
  })

  const sorted = [...categorias].sort((a, b) => {
    const orderA = a.orden ?? 0
    const orderB = b.orden ?? 0
    if (orderA !== orderB) return orderA - orderB
    return a.nombre.localeCompare(b.nombre)
  })

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
              Catálogo del cotizador
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Categorías y servicios disponibles para construir cotizaciones.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/cotizador/catalogo/servicios"
              className="inline-flex items-center gap-2 border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Servicios
            </Link>
            <Link
              href="/dashboard/cotizador/catalogo/categorias/nueva"
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              + Nueva categoría
            </Link>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-playfair text-lg font-semibold text-neutral-900">
          Categorías
        </h2>

        {sorted.length === 0 ? (
          <div className="border border-dashed border-neutral-300 bg-white py-12 text-center">
            <p className="text-sm text-neutral-500">
              No hay categorías creadas aún.
            </p>
            <Link
              href="/dashboard/cotizador/catalogo/categorias/nueva"
              className="mt-3 inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Crear primera categoría
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-200 bg-white">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-3 py-2 text-left">Nombre</th>
                  <th className="px-3 py-2 text-left">Región</th>
                  <th className="px-3 py-2 text-left">Tipo</th>
                  <th className="px-3 py-2 text-right">Servicios</th>
                  <th className="px-3 py-2 text-left">Orden</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((categoria) => {
                  const count = serviciosPorCategoria.get(categoria.id) ?? 0
                  return (
                    <tr
                      key={categoria.id}
                      className="border-t border-neutral-100"
                    >
                      <td className="px-3 py-2 font-medium text-neutral-900">
                        {categoria.nombre}
                      </td>
                      <td className="px-3 py-2 text-neutral-700">
                        {categoria.region ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-neutral-700">
                        {categoria.tipo ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        <Link
                          href={`/dashboard/cotizador/catalogo/servicios?categoria=${categoria.id}`}
                          className="text-primary hover:underline"
                        >
                          {count}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-neutral-700">
                        {categoria.orden ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs ${
                            categoria.activo === false
                              ? "bg-neutral-100 text-neutral-600"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {categoria.activo === false ? "Inactivo" : "Activo"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-3 text-neutral-500">
                          <Link
                            href={`/dashboard/cotizador/catalogo/categorias/${categoria.id}/editar`}
                            title="Editar"
                            className="transition-colors hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <DeleteQuoterItemButton
                            endpoint={`/api/dashboard/cotizador-categorias/${categoria.id}`}
                            label="Eliminar categoría"
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
