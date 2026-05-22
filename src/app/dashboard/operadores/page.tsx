import { CurrencyDollar, FileText, HandCoins, UsersThree } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

import { RecentSentQuotes } from "@/components/dashboard/recent-sent-quotes"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { OperatorActivityCard } from "@/components/dashboard/operator-activity-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerQuotesController } from "@/controllers/quotes/quotes.controller"
import { createServerOperatorsController } from "@/controllers/operators/operators.controller"
import { createServerOperatorRequestsController } from "@/controllers/operator-requests/operator-requests.controller"
import type { QuotesRow } from "@/types/quotes/quotes.types"
import type { OperatorsRow } from "@/types/operators/operators.types"
import type { OperatorRequestsRow } from "@/types/operator-requests/operator-requests.types"

export const dynamic = "force-dynamic"

const statusStyles: Record<OperatorRequestsRow["estado"], string> = {
  pendiente: "bg-amber-100 text-amber-800",
  en_revision: "bg-blue-100 text-blue-800",
  aprobada: "bg-emerald-100 text-emerald-800",
  rechazada: "bg-rose-100 text-rose-800",
  cancelada: "bg-neutral-200 text-neutral-700",
}

const statusLabels: Record<OperatorRequestsRow["estado"], string> = {
  pendiente: "Pendiente",
  en_revision: "En revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
}

const DAY_MS = 24 * 60 * 60 * 1000

function getNow(): number {
  return new Date().getTime()
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0)
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatRelative(iso: string | null): string {
  if (!iso) return "sin fecha"
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  if (Number.isNaN(diffMs)) return "sin fecha"

  const days = Math.floor(diffMs / DAY_MS)
  if (days <= 0) return "hoy"
  if (days === 1) return "ayer"
  if (days < 7) return `hace ${days} días`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`
  }
  if (days < 365) {
    const months = Math.floor(days / 30)
    return `hace ${months} ${months === 1 ? "mes" : "meses"}`
  }
  const years = Math.floor(days / 365)
  return `hace ${years} ${years === 1 ? "año" : "años"}`
}

function computeTrend(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) {
      return { label: "Sin datos previos", direction: "flat" as const }
    }
    return { label: "Nuevo este período", direction: "up" as const }
  }
  const diff = current - previous
  const pct = Math.round((diff / previous) * 100)
  if (pct === 0) return { label: "Sin cambios", direction: "flat" as const }
  return {
    label: `${Math.abs(pct)}% vs período anterior`,
    direction: pct > 0 ? ("up" as const) : ("down" as const),
  }
}

type OperatorAggregate = {
  operador: OperatorsRow
  enviadas: number
  borradores: number
  totalVenta: number
  lastActivityIso: string | null
}

// `cotizaciones.operador_id` referencia `usuarios.id` (auth user id), NO
// `operadores.id`. Por eso hay que indexar agregados por `usuario_id` y
// hacer un fallback al `id` por si algún operador no tiene `usuario_id`.
function buildOperatorAggregates(
  operadores: OperatorsRow[],
  cotizaciones: QuotesRow[],
): Map<string, OperatorAggregate> {
  const map = new Map<string, OperatorAggregate>()

  for (const operador of operadores) {
    const key = operador.usuario_id ?? operador.id
    map.set(key, {
      operador,
      enviadas: 0,
      borradores: 0,
      totalVenta: 0,
      lastActivityIso: null,
    })
  }

  for (const cot of cotizaciones) {
    const entry = map.get(cot.operador_id)
    if (!entry) continue

    if (cot.estado === "enviada") {
      entry.enviadas += 1
      entry.totalVenta += Number(cot.total_venta ?? 0)
    } else if (cot.estado === "borrador") {
      entry.borradores += 1
    }

    const candidate = cot.updated_at ?? cot.created_at
    if (
      candidate &&
      (!entry.lastActivityIso ||
        new Date(candidate).getTime() > new Date(entry.lastActivityIso).getTime())
    ) {
      entry.lastActivityIso = candidate
    }
  }

  return map
}

export default async function DashboardOperatorsPage() {
  const operatorsController = await createServerOperatorsController()
  const requestsController = await createServerOperatorRequestsController()
  const quotesController = await createServerQuotesController()

  const [operadores, pendientes, enRevision, cotizaciones] = await Promise.all([
    operatorsController.list(),
    requestsController.list({ estado: "pendiente" }),
    requestsController.list({ estado: "en_revision" }),
    quotesController.listAll(),
  ])

  const activos = operadores.filter((o) => o.activo !== false)
  const porRevisar = [...pendientes, ...enRevision].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const totalPorRevisar = porRevisar.length

  // KPI: operadores nuevos en últimos 30 días
  const now = getNow()
  const last30Start = now - 30 * DAY_MS
  const prev30Start = now - 60 * DAY_MS

  const operatorsNuevos30 = operadores.filter((o) => {
    if (!o.created_at) return false
    const t = new Date(o.created_at).getTime()
    return t >= last30Start
  }).length

  // Cotizaciones enviadas
  const enviadas = cotizaciones.filter((c) => c.estado === "enviada")
  const enviadasLast30 = enviadas.filter((c) => {
    const ref = c.updated_at ?? c.created_at
    if (!ref) return false
    const t = new Date(ref).getTime()
    return t >= last30Start
  })
  const enviadasPrev30 = enviadas.filter((c) => {
    const ref = c.updated_at ?? c.created_at
    if (!ref) return false
    const t = new Date(ref).getTime()
    return t >= prev30Start && t < last30Start
  })

  const trendEnviadas = computeTrend(enviadasLast30.length, enviadasPrev30.length)

  const totalVentaEnviadas = enviadas.reduce(
    (sum, c) => sum + Number(c.total_venta ?? 0),
    0,
  )
  const totalComisionEnviadas = enviadas.reduce(
    (sum, c) => sum + Number(c.total_comision ?? 0),
    0,
  )

  // Últimas enviadas
  const ultimasEnviadas = [...enviadas]
    .sort(
      (a, b) =>
        new Date(b.updated_at ?? b.created_at).getTime() -
        new Date(a.updated_at ?? a.created_at).getTime(),
    )
    .slice(0, 8)

  // El map se indexa por `usuario_id` (lo que `cotizaciones.operador_id`
  // realmente apunta) con fallback a `id`. Las cotizaciones almacenan el
  // auth user id en `operador_id`, no la PK de la tabla `operadores`.
  const operatorsMap = new Map(
    operadores.map((o) => [o.usuario_id ?? o.id, o]),
  )
  const aggregates = buildOperatorAggregates(operadores, cotizaciones)

  // Activos ordenados por última actividad (con actividad primero, luego sin)
  const activosConData = activos
    .map((o) => aggregates.get(o.usuario_id ?? o.id))
    .filter((agg): agg is OperatorAggregate => Boolean(agg))

  const activosConActividad = activosConData
    .filter((agg) => agg.lastActivityIso !== null)
    .sort(
      (a, b) =>
        new Date(b.lastActivityIso ?? 0).getTime() -
        new Date(a.lastActivityIso ?? 0).getTime(),
    )

  const activosSinActividad = activosConData.filter(
    (agg) => agg.lastActivityIso === null,
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
          Operadores
        </h1>
        <p className="text-sm text-neutral-500">
          Gestioná las altas, las solicitudes pendientes y la actividad de los operadores.
        </p>
      </header>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<UsersThree size={22} weight="duotone" />}
          label="Operadores activos"
          value={String(activos.length)}
          trend={
            operatorsNuevos30 > 0
              ? {
                  label: `+${operatorsNuevos30} nuevos (30 días)`,
                  direction: "up",
                }
              : undefined
          }
          helper={operatorsNuevos30 === 0 ? "Sin altas en 30 días" : undefined}
        />
        <KpiCard
          icon={<FileText size={22} weight="duotone" />}
          label="Cotizaciones enviadas (30d)"
          value={String(enviadasLast30.length)}
          trend={trendEnviadas}
          accentClassName="bg-emerald-100 text-emerald-700"
        />
        <KpiCard
          icon={<CurrencyDollar size={22} weight="duotone" />}
          label="Venta acumulada"
          value={formatCurrency(totalVentaEnviadas)}
          helper={`${enviadas.length} cotizaciones enviadas`}
          accentClassName="bg-sky-100 text-sky-700"
        />
        <KpiCard
          icon={<HandCoins size={22} weight="duotone" />}
          label="Comisión operadores"
          value={formatCurrency(totalComisionEnviadas)}
          helper="Total de cotizaciones enviadas"
          accentClassName="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Solicitudes pendientes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-playfair text-lg font-semibold">
              Solicitudes por revisar
            </h2>
            <p className="text-xs text-neutral-500">
              {pendientes.length} pendientes · {enRevision.length} en revisión
            </p>
          </div>
          {totalPorRevisar > 0 ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/operadores/solicitudes">Ver todas →</Link>
            </Button>
          ) : null}
        </div>

        {porRevisar.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No hay solicitudes pendientes. Cuando un usuario aplique para ser
              operador, va a aparecer acá.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {porRevisar.slice(0, 5).map((solicitud) => (
              <Link
                key={solicitud.id}
                href={`/dashboard/operadores/solicitudes/${solicitud.id}`}
                className="block"
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900 truncate">
                        {solicitud.nombre_comercial}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {solicitud.email_contacto}
                        {solicitud.telefono_contacto
                          ? ` · ${solicitud.telefono_contacto}`
                          : ""}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Enviada el {formatDate(solicitud.created_at)}
                        {solicitud.zona_operacion ? ` · ${solicitud.zona_operacion}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[solicitud.estado]
                        }`}
                      >
                        {statusLabels[solicitud.estado]}
                      </span>
                      <span className="text-xs text-primary font-medium hidden sm:inline">
                        Revisar →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {porRevisar.length > 5 ? (
              <p className="text-center text-xs text-neutral-500 pt-2">
                +{porRevisar.length - 5} más en{" "}
                <Link
                  href="/dashboard/operadores/solicitudes"
                  className="text-primary underline"
                >
                  Ver todas las solicitudes
                </Link>
              </p>
            ) : null}
          </div>
        )}
      </section>

      {/* Últimas cotizaciones enviadas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-playfair text-lg font-semibold">
              Últimas cotizaciones enviadas
            </h2>
            <p className="text-xs text-neutral-500">
              Cotizaciones marcadas como enviadas por los operadores.
            </p>
          </div>
          {enviadas.length > 0 ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/cotizador/cotizaciones">Ver todas →</Link>
            </Button>
          ) : null}
        </div>
        <RecentSentQuotes
          cotizaciones={ultimasEnviadas}
          operatorsMap={operatorsMap}
          formatCurrency={formatCurrency}
          formatRelative={formatRelative}
        />
      </section>

      {/* Operadores activos */}
      <section className="space-y-4">
        <div>
          <h2 className="font-playfair text-lg font-semibold">Operadores activos</h2>
          <p className="text-xs text-neutral-500">
            Ordenados por última actividad en el cotizador.
          </p>
        </div>

        {activos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Todavía no hay operadores activos. Aprobá solicitudes para sumar al equipo.
            </CardContent>
          </Card>
        ) : (
          <>
            {activosConActividad.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activosConActividad.map((agg) => (
                  <OperatorActivityCard
                    key={agg.operador.id}
                    operador={agg.operador}
                    enviadasCount={agg.enviadas}
                    borradorCount={agg.borradores}
                    totalVenta={agg.totalVenta}
                    lastActivityIso={agg.lastActivityIso}
                    formatCurrency={formatCurrency}
                    formatRelative={formatRelative}
                  />
                ))}
              </div>
            ) : null}

            {activosSinActividad.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-neutral-700">
                    Operadores sin actividad
                  </h3>
                  <span className="text-xs text-neutral-400">
                    ({activosSinActividad.length})
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Estos operadores todavía no usaron el cotizador.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activosSinActividad.map((agg) => (
                    <OperatorActivityCard
                      key={agg.operador.id}
                      operador={agg.operador}
                      enviadasCount={agg.enviadas}
                      borradorCount={agg.borradores}
                      totalVenta={agg.totalVenta}
                      lastActivityIso={agg.lastActivityIso}
                      formatCurrency={formatCurrency}
                      formatRelative={formatRelative}
                      muted
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* Inactivos (referencia rápida) */}
        {operadores.some((o) => o.activo === false) ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Operadores inactivos</CardTitle>
              <CardDescription>
                {operadores.filter((o) => o.activo === false).length}{" "}
                {operadores.filter((o) => o.activo === false).length === 1
                  ? "operador deshabilitado"
                  : "operadores deshabilitados"}
                .
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}
      </section>
    </div>
  )
}
