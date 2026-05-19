import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowSquareOut, CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import { createServerOperadoresController } from "@/controllers/operadores/operadores.controller"
import type { CotizacionEstado } from "@/types/cotizaciones/cotizaciones.types"

export const dynamic = "force-dynamic"

interface OperadorDetallePageProps {
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
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function OperadorDetallePage({
  params,
}: OperadorDetallePageProps) {
  const { id } = await params

  const [operadoresController, cotizacionesController] = await Promise.all([
    createServerOperadoresController(),
    createServerCotizacionesController(),
  ])

  let operador
  try {
    operador = await operadoresController.getById(id)
  } catch {
    notFound()
  }

  if (!operador) notFound()

  const cotizaciones = await cotizacionesController.list({ operador_id: id })
  const sorted = [...cotizaciones]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 15)

  const totales = cotizaciones.reduce(
    (acc, cot) => {
      acc.total += 1
      acc.venta += Number(cot.total_venta ?? 0)
      acc.comision += Number(cot.total_comision ?? 0)
      if (cot.estado === "enviada") acc.enviadas += 1
      if (cot.estado === "borrador") acc.borradores += 1
      return acc
    },
    { total: 0, venta: 0, comision: 0, enviadas: 0, borradores: 0 },
  )

  const redes = operador.redes_sociales
    ? Object.entries(operador.redes_sociales)
    : []

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <Link
          href="/dashboard/operadores"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a operadores
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
              {operador.nombre_comercial ?? operador.nombre}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">{operador.email}</p>
          </div>
          <span
            className={`inline-block px-3 py-1 text-xs font-medium ${
              operador.activo === false
                ? "bg-neutral-100 text-neutral-600"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {operador.activo === false ? "Inactivo" : "Activo"}
          </span>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-neutral-700">
            <p>{operador.contacto_nombre ?? "—"}</p>
            <p>{operador.telefono_contacto ?? "Sin teléfono"}</p>
            {operador.sitio_web ? (
              <a
                href={operador.sitio_web}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {operador.sitio_web}
                <ArrowSquareOut className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Operación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-neutral-700">
            <p>
              <strong>Ciudad:</strong> {operador.ciudad ?? "—"}
              {operador.provincia ? `, ${operador.provincia}` : ""}
            </p>
            <p>
              <strong>Zona:</strong> {operador.zona_operacion ?? "—"}
            </p>
            {operador.documento ? (
              <p>
                <strong>Documento:</strong> {operador.documento}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cotizaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-neutral-700">
            <p>
              <strong>{totales.total}</strong> totales
            </p>
            <p>
              {totales.enviadas} enviadas · {totales.borradores} en borrador
            </p>
            <p>
              Venta acumulada:{" "}
              <strong className="tabular-nums">
                {formatMoney(totales.venta)}
              </strong>
            </p>
            <p>
              Comisión:{" "}
              <strong className="tabular-nums">
                {formatMoney(totales.comision)}
              </strong>
            </p>
          </CardContent>
        </Card>
      </section>

      {operador.experiencia_descripcion ? (
        <section className="border border-neutral-200 bg-white p-5 space-y-2">
          <h2 className="font-playfair text-lg font-semibold text-neutral-900">
            Experiencia
          </h2>
          <p className="whitespace-pre-wrap text-sm text-neutral-700">
            {operador.experiencia_descripcion}
          </p>
        </section>
      ) : null}

      {redes.length > 0 ? (
        <section className="border border-neutral-200 bg-white p-5 space-y-2">
          <h2 className="font-playfair text-lg font-semibold text-neutral-900">
            Redes sociales
          </h2>
          <ul className="space-y-1 text-sm">
            {redes.map(([key, value]) => (
              <li key={key}>
                <span className="capitalize text-neutral-500">{key}: </span>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {value}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-lg font-semibold text-neutral-900">
            Cotizaciones recientes
          </h2>
          <Link
            href={`/dashboard/cotizador/cotizaciones?operador=${operador.id}`}
            className="text-xs text-primary hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        {sorted.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Este operador no generó cotizaciones aún.
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto border border-neutral-200 bg-white">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-3 py-2 text-left">Cliente</th>
                  <th className="px-3 py-2 text-left">Fechas</th>
                  <th className="px-3 py-2 text-right">Total final</th>
                  <th className="px-3 py-2 text-left">Estado</th>
                  <th className="px-3 py-2 text-left">Creada</th>
                  <th className="px-3 py-2 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((cot) => (
                  <tr key={cot.id} className="border-t border-neutral-100">
                    <td className="px-3 py-2 text-neutral-900">
                      {cot.cliente_nombre ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-neutral-700">
                      {formatDate(cot.fecha_inicio)} →{" "}
                      {formatDate(cot.fecha_fin)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium">
                      {formatMoney(Number(cot.total_final ?? 0))}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs ${
                          ESTADO_STYLES[cot.estado]
                        }`}
                      >
                        {ESTADO_LABELS[cot.estado]}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-neutral-500">
                      {formatDate(cot.created_at)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Link
                        href={`/dashboard/cotizador/cotizaciones/${cot.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Ver <ArrowSquareOut className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
