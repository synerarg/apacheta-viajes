import Link from "next/link"
import { notFound } from "next/navigation"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import { createServerCotizacionesItemsController } from "@/controllers/cotizaciones-items/cotizaciones-items.controller"
import { createServerOperadoresController } from "@/controllers/operadores/operadores.controller"
import type { CotizacionEstado } from "@/types/cotizaciones/cotizaciones.types"

export const dynamic = "force-dynamic"

interface CotizacionDetallePageProps {
  params: Promise<{ id: string }>
}

const ESTADO_LABELS: Record<CotizacionEstado, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  archivada: "Archivada",
}

const ESTADO_STYLES: Record<CotizacionEstado, string> = {
  borrador: "bg-neutral-100 text-neutral-700",
  enviada: "bg-emerald-100 text-emerald-800",
  archivada: "bg-blue-100 text-blue-800",
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "—"
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(value)
}

export default async function CotizacionDetallePage({
  params,
}: CotizacionDetallePageProps) {
  const { id } = await params

  const [
    cotizacionesController,
    itemsController,
    operadoresController,
  ] = await Promise.all([
    createServerCotizacionesController(),
    createServerCotizacionesItemsController(),
    createServerOperadoresController(),
  ])

  let cotizacion
  try {
    cotizacion = await cotizacionesController.getById(id)
  } catch {
    notFound()
  }

  if (!cotizacion) notFound()

  const [items, operadores] = await Promise.all([
    itemsController.list({ cotizacion_id: id }),
    operadoresController.list(),
  ])

  const operador = operadores.find((o) => o.id === cotizacion.operador_id)
  const sortedItems = [...items].sort((a, b) => {
    if (a.dia_offset !== b.dia_offset) return a.dia_offset - b.dia_offset
    return (a.orden ?? 0) - (b.orden ?? 0)
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <Link
          href="/dashboard/cotizador/cotizaciones"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a cotizaciones
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Cotización #{cotizacion.token.slice(0, 8).toUpperCase()}
            </p>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
              {cotizacion.cliente_nombre ?? "Sin cliente"}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Creada {formatDate(cotizacion.created_at)} · Última actualización{" "}
              {formatDate(cotizacion.updated_at)}
            </p>
          </div>
          <span
            className={`inline-block self-start px-3 py-1 text-xs font-medium ${
              ESTADO_STYLES[cotizacion.estado]
            }`}
          >
            {ESTADO_LABELS[cotizacion.estado]}
          </span>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="border border-neutral-200 bg-white p-4 space-y-2">
          <h2 className="text-xs uppercase tracking-wide text-neutral-500">
            Cliente
          </h2>
          <p className="text-sm font-medium text-neutral-900">
            {cotizacion.cliente_nombre ?? "—"}
          </p>
          <p className="text-sm text-neutral-700">
            {cotizacion.cliente_email ?? "Sin email"}
          </p>
          <p className="text-sm text-neutral-700">
            {cotizacion.cliente_telefono ?? "Sin teléfono"}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-4 space-y-2">
          <h2 className="text-xs uppercase tracking-wide text-neutral-500">
            Viaje
          </h2>
          <p className="text-sm text-neutral-700">
            <strong>Desde:</strong> {formatDate(cotizacion.fecha_inicio)}
          </p>
          <p className="text-sm text-neutral-700">
            <strong>Hasta:</strong> {formatDate(cotizacion.fecha_fin)}
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-4 space-y-2">
          <h2 className="text-xs uppercase tracking-wide text-neutral-500">
            Operador
          </h2>
          <p className="text-sm font-medium text-neutral-900">
            {operador?.nombre_comercial ?? operador?.nombre ?? "—"}
          </p>
          {operador?.email ? (
            <p className="text-sm text-neutral-700">{operador.email}</p>
          ) : null}
          {operador?.telefono_contacto ? (
            <p className="text-sm text-neutral-700">
              {operador.telefono_contacto}
            </p>
          ) : null}
          {operador ? (
            <Link
              href={`/dashboard/operadores/${operador.id}`}
              className="inline-block text-xs text-primary hover:underline"
            >
              Ver perfil del operador →
            </Link>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair text-lg font-semibold text-neutral-900">
          Ítems
        </h2>
        {sortedItems.length === 0 ? (
          <div className="border border-dashed border-neutral-300 bg-white py-8 text-center text-sm text-neutral-500">
            Esta cotización no tiene ítems cargados.
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-200 bg-white">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-3 py-2 text-left">Día</th>
                  <th className="px-3 py-2 text-left">Servicio</th>
                  <th className="px-3 py-2 text-right">Adultos</th>
                  <th className="px-3 py-2 text-right">Menores</th>
                  <th className="px-3 py-2 text-right">Precio adulto</th>
                  <th className="px-3 py-2 text-right">Precio menor</th>
                  <th className="px-3 py-2 text-right">Subtotal venta</th>
                  <th className="px-3 py-2 text-right">Comisión</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr key={item.id} className="border-t border-neutral-100">
                    <td className="px-3 py-2 text-neutral-700">
                      Día {item.dia_offset + 1}
                      {item.fecha ? (
                        <p className="text-xs text-neutral-500">
                          {formatDate(item.fecha)}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-medium text-neutral-900">
                        {item.servicio_nombre}
                      </p>
                      {item.servicio_descripcion ? (
                        <p className="text-xs text-neutral-500">
                          {item.servicio_descripcion}
                        </p>
                      ) : null}
                      {item.is_special ? (
                        <span className="mt-1 inline-block bg-violet-100 px-1.5 py-0.5 text-[10px] uppercase text-violet-800">
                          Especial
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {item.adultos}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {item.menores}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatMoney(Number(item.precio_adulto_unit ?? 0))}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {item.precio_menor_unit !== null
                        ? formatMoney(Number(item.precio_menor_unit))
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium">
                      {formatMoney(Number(item.subtotal_venta ?? 0))}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatMoney(Number(item.subtotal_comision ?? 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {cotizacion.recomendaciones && cotizacion.recomendaciones.length > 0 ? (
        <section className="space-y-2">
          <h2 className="font-playfair text-lg font-semibold text-neutral-900">
            Recomendaciones
          </h2>
          <ul className="list-disc space-y-1 border border-neutral-200 bg-white p-4 pl-8 text-sm text-neutral-700">
            {cotizacion.recomendaciones.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {cotizacion.notas_internas ? (
        <section className="space-y-2">
          <h2 className="font-playfair text-lg font-semibold text-neutral-900">
            Notas internas
          </h2>
          <p className="whitespace-pre-wrap border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
            {cotizacion.notas_internas}
          </p>
        </section>
      ) : null}

      <section className="border-2 border-primary bg-white p-5">
        <h2 className="mb-4 font-playfair text-lg font-semibold text-neutral-900">
          Totales
        </h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-5">
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Venta
            </dt>
            <dd className="text-lg font-medium text-neutral-900 tabular-nums">
              {formatMoney(Number(cotizacion.total_venta ?? 0))}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Comisión
            </dt>
            <dd className="text-lg font-medium text-neutral-900 tabular-nums">
              {formatMoney(Number(cotizacion.total_comision ?? 0))}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Neto
            </dt>
            <dd className="text-lg font-medium text-neutral-900 tabular-nums">
              {formatMoney(Number(cotizacion.total_neto ?? 0))}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Impuesto ({cotizacion.impuesto_pct}%)
            </dt>
            <dd className="text-lg font-medium text-neutral-900 tabular-nums">
              {formatMoney(Number(cotizacion.total_impuesto ?? 0))}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-primary">
              Total final
            </dt>
            <dd className="text-2xl font-bold text-primary tabular-nums">
              {formatMoney(Number(cotizacion.total_final ?? 0))}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
