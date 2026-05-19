import Link from "next/link"
import { CaretLeft, CurrencyDollar, Pencil } from "@phosphor-icons/react/dist/ssr"

import { DeleteCotizadorItemButton } from "@/components/dashboard/delete-cotizador-item-button"
import { createServerCotizadorCategoriasController } from "@/controllers/cotizador-categorias/cotizador-categorias.controller"
import { createServerCotizadorServiciosController } from "@/controllers/cotizador-servicios/cotizador-servicios.controller"

export const dynamic = "force-dynamic"

interface ServiciosPageProps {
  searchParams: Promise<{ categoria?: string }>
}

export default async function CotizadorServiciosPage({
  searchParams,
}: ServiciosPageProps) {
  const { categoria: categoriaFilter } = await searchParams

  const [categoriasController, serviciosController] = await Promise.all([
    createServerCotizadorCategoriasController(),
    createServerCotizadorServiciosController(),
  ])

  const [categorias, servicios] = await Promise.all([
    categoriasController.list(),
    serviciosController.list(),
  ])

  const categoriasMap = new Map(categorias.map((c) => [c.id, c]))

  const filtered = categoriaFilter
    ? servicios.filter((s) => s.categoria_id === categoriaFilter)
    : servicios

  const sorted = [...filtered].sort((a, b) => {
    const ordenA = a.orden ?? 0
    const ordenB = b.orden ?? 0
    if (ordenA !== ordenB) return ordenA - ordenB
    return a.nombre.localeCompare(b.nombre)
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <Link
          href="/dashboard/cotizador/catalogo"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver al catálogo
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
              Servicios
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Cada servicio puede tener múltiples precios por temporada.
            </p>
          </div>
          <Link
            href="/dashboard/cotizador/catalogo/servicios/nuevo"
            className="inline-flex self-start sm:self-auto items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            + Nuevo servicio
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/dashboard/cotizador/catalogo/servicios"
          className={`px-3 py-1.5 ${
            !categoriaFilter
              ? "bg-primary text-white"
              : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          }`}
        >
          Todas
        </Link>
        {categorias.map((categoria) => (
          <Link
            key={categoria.id}
            href={`/dashboard/cotizador/catalogo/servicios?categoria=${categoria.id}`}
            className={`px-3 py-1.5 ${
              categoriaFilter === categoria.id
                ? "bg-primary text-white"
                : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {categoria.nombre}
          </Link>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="border border-dashed border-neutral-300 bg-white py-12 text-center">
          <p className="text-sm text-neutral-500">
            No hay servicios{" "}
            {categoriaFilter ? "en esta categoría" : "creados aún"}.
          </p>
          <Link
            href="/dashboard/cotizador/catalogo/servicios/nuevo"
            className="mt-3 inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Crear servicio
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-neutral-200 bg-white">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Categoría</th>
                <th className="px-3 py-2 text-right">Comisión</th>
                <th className="px-3 py-2 text-left">Tipo</th>
                <th className="px-3 py-2 text-left">Orden</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((servicio) => {
                const categoria = servicio.categoria_id
                  ? categoriasMap.get(servicio.categoria_id)
                  : null
                return (
                  <tr key={servicio.id} className="border-t border-neutral-100">
                    <td className="px-3 py-2 font-medium text-neutral-900">
                      {servicio.nombre}
                      {servicio.descripcion ? (
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {servicio.descripcion}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-neutral-700">
                      {categoria?.nombre ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {servicio.comision_pct ?? 0}%
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1 text-[10px] uppercase">
                        {servicio.no_price ? (
                          <span className="inline-block bg-amber-100 px-1.5 py-0.5 text-amber-800">
                            Sin precio
                          </span>
                        ) : null}
                        {servicio.is_special ? (
                          <span className="inline-block bg-violet-100 px-1.5 py-0.5 text-violet-800">
                            Especial
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-neutral-700">
                      {servicio.orden ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs ${
                          servicio.activo === false
                            ? "bg-neutral-100 text-neutral-600"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {servicio.activo === false ? "Inactivo" : "Activo"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-3 text-neutral-500">
                        <Link
                          href={`/dashboard/cotizador/catalogo/precios/${servicio.id}`}
                          title="Precios"
                          className="transition-colors hover:text-primary"
                        >
                          <CurrencyDollar className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/dashboard/cotizador/catalogo/servicios/${servicio.id}/editar`}
                          title="Editar"
                          className="transition-colors hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteCotizadorItemButton
                          endpoint={`/api/dashboard/cotizador-servicios/${servicio.id}`}
                          label="Eliminar servicio"
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
    </div>
  )
}
