import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowSquareOut,
  CaretLeft,
  Clock,
  FileText,
} from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  OperadorActivityChart,
  buildMonthlyBuckets,
} from "@/components/dashboard/operador-activity-chart"
import { OperadorStatsCards } from "@/components/dashboard/operador-stats-cards"
import {
  OperadorTopClientes,
  buildTopClientes,
} from "@/components/dashboard/operador-top-clientes"
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

const MAX_TABLE_ROWS = 30

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

function formatRelative(iso: string | null) {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMin < 1) return "hace unos segundos"
  if (diffHours < 1) return `hace ${diffMin} min`
  if (diffDays < 1) return "hoy"
  if (diffDays === 1) return "ayer"
  if (diffDays < 7) return `hace ${diffDays} días`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `hace ${weeks} semana${weeks === 1 ? "" : "s"}`
  }
  const months = Math.floor(diffDays / 30)
  if (months < 12) return `hace ${months} mes${months === 1 ? "" : "es"}`
  const years = Math.floor(diffDays / 365)
  return `hace ${years} año${years === 1 ? "" : "s"}`
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

  // `cotizaciones.operador_id` apunta a `usuarios.id`, no a `operadores.id`.
  // Si el operador no tiene `usuario_id` vinculado, no hay cotizaciones que
  // mostrar.
  const cotizaciones = operador.usuario_id
    ? await cotizacionesController.list({ operador_id: operador.usuario_id })
    : []
  const sorted = [...cotizaciones].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const tableRows = sorted.slice(0, MAX_TABLE_ROWS)

  const totales = cotizaciones.reduce(
    (acc, cot) => {
      acc.total += 1
      if (cot.estado === "enviada") {
        acc.enviadas += 1
        acc.ventaEnviadas += Number(cot.total_venta ?? 0)
        acc.comisionEnviadas += Number(cot.total_comision ?? 0)
      }
      if (cot.estado === "borrador") acc.borradores += 1
      if (cot.estado === "archivada") acc.archivadas += 1
      return acc
    },
    {
      total: 0,
      enviadas: 0,
      borradores: 0,
      archivadas: 0,
      ventaEnviadas: 0,
      comisionEnviadas: 0,
    },
  )

  const ultimaCotizacion = sorted[0] ?? null
  const ultimaEnviada =
    sorted.find((cot) => cot.estado === "enviada") ?? null

  const monthlyBuckets = buildMonthlyBuckets(
    cotizaciones.map((c) => c.created_at),
    6,
  )

  const topClientes = buildTopClientes(cotizaciones, 5)

  const redes = operador.redes_sociales
    ? Object.entries(operador.redes_sociales)
    : []

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <Link
          href="/dashboard/operadores"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
          aria-label="Volver al listado de operadores"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a operadores
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-neutral-900 truncate">
              {operador.nombre_comercial ?? operador.nombre}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
              {operador.email ? <span>{operador.email}</span> : null}
              {operador.telefono_contacto ? (
                <span>{operador.telefono_contacto}</span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium ${
                operador.activo === false
                  ? "bg-neutral-100 text-neutral-600"
                  : "bg-emerald-100 text-emerald-800"
              }`}
              aria-label={
                operador.activo === false
                  ? "Operador inactivo"
                  : "Operador activo"
              }
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  operador.activo === false
                    ? "bg-neutral-400"
                    : "bg-emerald-500"
                }`}
                aria-hidden
              />
              {operador.activo === false ? "Inactivo" : "Activo"}
            </span>
            <span
              className="inline-flex items-center gap-1.5 bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
              title="Última cotización generada por el operador"
            >
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {ultimaCotizacion
                ? `Última actividad: ${formatRelative(ultimaCotizacion.created_at)}`
                : "Sin actividad aún"}
            </span>
            {ultimaEnviada ? (
              <span
                className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 text-xs text-emerald-800"
                title="Última cotización enviada al cliente"
              >
                <Clock className="h-3.5 w-3.5" aria-hidden />
                Última enviada: {formatRelative(ultimaEnviada.updated_at)}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <OperadorStatsCards
        total={totales.total}
        enviadas={totales.enviadas}
        borradores={totales.borradores}
        archivadas={totales.archivadas}
        ventaEnviadas={totales.ventaEnviadas}
        comisionEnviadas={totales.comisionEnviadas}
      />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OperadorActivityChart buckets={monthlyBuckets} />
        </div>
        <OperadorTopClientes clientes={topClientes} />
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

        {tableRows.length === 0 ? (
          <div className="border border-neutral-200 bg-white">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FileText
                className="h-10 w-10 text-neutral-400 opacity-50"
                weight="duotone"
                aria-hidden
              />
              <p className="mt-3 text-sm text-neutral-500">
                Este operador no generó cotizaciones aún.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`overflow-x-auto border border-neutral-200 bg-white ${
                tableRows.length > 15
                  ? "max-h-[600px] overflow-y-auto"
                  : ""
              }`}
            >
              <table className="w-full min-w-[900px] text-sm">
                <thead
                  className={`bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500 ${
                    tableRows.length > 15 ? "sticky top-0 z-10" : ""
                  }`}
                >
                  <tr>
                    <th className="px-3 py-2.5 text-left font-medium">Cliente</th>
                    <th className="px-3 py-2.5 text-left font-medium">Token</th>
                    <th className="px-3 py-2.5 text-left font-medium">Fechas</th>
                    <th className="px-3 py-2.5 text-right font-medium">Total final</th>
                    <th className="px-3 py-2.5 text-left font-medium">Estado</th>
                    <th className="px-3 py-2.5 text-left font-medium">Creada</th>
                    <th className="px-3 py-2.5 text-right font-medium">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((cot) => (
                    <tr
                      key={cot.id}
                      className="border-t border-neutral-100 transition-colors even:bg-neutral-50/50 hover:bg-neutral-50"
                    >
                      <td className="px-3 py-2.5 text-neutral-900">
                        {cot.cliente_nombre ?? "—"}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-neutral-500">
                        {cot.token ? cot.token.slice(0, 8) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-neutral-700 tabular-nums">
                        {formatDate(cot.fecha_inicio)} →{" "}
                        {formatDate(cot.fecha_fin)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums font-medium">
                        {formatMoney(Number(cot.total_final ?? 0))}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`inline-block w-fit px-2 py-0.5 text-xs ${
                              ESTADO_STYLES[cot.estado]
                            }`}
                          >
                            {ESTADO_LABELS[cot.estado]}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            {formatRelative(cot.updated_at)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-neutral-500 tabular-nums">
                        {formatDate(cot.created_at)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <Link
                          href={`/dashboard/cotizador/cotizaciones/${cot.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                          aria-label={`Ver detalle de cotización de ${
                            cot.cliente_nombre ?? "cliente sin nombre"
                          }`}
                        >
                          Ver{" "}
                          <ArrowSquareOut
                            className="h-3.5 w-3.5"
                            aria-hidden
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sorted.length > MAX_TABLE_ROWS ? (
              <div className="flex justify-end">
                <Link
                  href={`/dashboard/cotizador/cotizaciones?operador=${operador.id}`}
                  className="text-xs text-primary hover:underline"
                >
                  Ver todas en el cotizador ({sorted.length}) →
                </Link>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}
