import Link from "next/link"
import { redirect } from "next/navigation"
import {
  PencilSimpleLine,
  PaperPlaneTilt,
  Archive,
} from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EliminarCotizacionButton } from "@/components/operador/eliminar-cotizacion-button"
import { createClient } from "@/lib/supabase/server"
import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import type { CotizacionesRow } from "@/types/cotizaciones/cotizaciones.types"

export const dynamic = "force-dynamic"

const TABS = [
  { key: "borrador", label: "Activas" },
  { key: "enviada", label: "Enviadas" },
  { key: "archivada", label: "Archivadas" },
] as const

type TabKey = (typeof TABS)[number]["key"]

const ESTADO_META: Record<
  CotizacionesRow["estado"],
  {
    label: string
    dot: string
    pill: string
    border: string
    Icon: typeof PencilSimpleLine
  }
> = {
  borrador: {
    label: "Activa",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    border: "border-l-amber-500",
    Icon: PencilSimpleLine,
  },
  enviada: {
    label: "Enviada",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
    border: "border-l-emerald-500",
    Icon: PaperPlaneTilt,
  },
  archivada: {
    label: "Archivada",
    dot: "bg-neutral-400",
    pill: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200",
    border: "border-l-neutral-300",
    Icon: Archive,
  },
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatMoney(value: number) {
  return `$${Math.round(value || 0).toLocaleString("es-AR")}`
}

export default async function OperadorPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const params = await searchParams
  const activeTab: TabKey =
    (TABS.find((tab) => tab.key === params.estado)?.key as TabKey | undefined) ??
    "borrador"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login?next=/operador")
  }

  const controller = await createServerCotizacionesController()
  const all = await controller.listMine(user.id)
  const counts: Record<TabKey, number> = {
    borrador: 0,
    enviada: 0,
    archivada: 0,
  }
  for (const cot of all) counts[cot.estado] = (counts[cot.estado] ?? 0) + 1
  const cotizaciones: CotizacionesRow[] = all.filter(
    (c) => c.estado === activeTab,
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
            Mis cotizaciones
          </h1>
          <p className="text-sm text-neutral-500">
            Armá itinerarios personalizados, calculá tu comisión y compartilos con
            tus clientes.
          </p>
        </div>
        <Button asChild>
          <Link href="/operador/cotizaciones/nueva">+ Nueva cotización</Link>
        </Button>
      </header>

      <div className="rounded-lg border border-neutral-200 bg-white p-3 sm:p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Referencia de estados
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-neutral-600">
          {(Object.keys(ESTADO_META) as CotizacionesRow["estado"][]).map(
            (estado) => {
              const meta = ESTADO_META[estado]
              return (
                <div key={estado} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  <span className="font-medium text-neutral-800">
                    {meta.label}
                  </span>
                  <span className="text-neutral-400">
                    {estado === "borrador"
                      ? "— editable, todavía no se compartió"
                      : estado === "enviada"
                        ? "— ya se mandó al cliente, link público activo"
                        : "— guardada como histórico, no se edita"}
                  </span>
                </div>
              )
            },
          )}
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2">
        {TABS.map((tab) => {
          const meta = ESTADO_META[tab.key]
          const isActive = activeTab === tab.key
          return (
            <Link
              key={tab.key}
              href={`/operador?estado=${tab.key}`}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-white/80" : meta.dot
                }`}
              />
              {tab.label}
              <span
                className={`text-[11px] font-semibold ${
                  isActive ? "text-white/80" : "text-neutral-500"
                }`}
              >
                {counts[tab.key]}
              </span>
            </Link>
          )
        })}
      </nav>

      {cotizaciones.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No tenés cotizaciones en este estado.
            <div className="mt-4">
              <Button asChild size="sm">
                <Link href="/operador/cotizaciones/nueva">Crear una nueva</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {cotizaciones.map((cot) => {
            const meta = ESTADO_META[cot.estado]
            const Icon = meta.Icon
            return (
              <Card
                key={cot.id}
                className={`border-l-4 ${meta.border} transition-shadow hover:shadow-md`}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/operador/cotizaciones/${cot.id}`}
                      className="min-w-0 flex-1 space-y-1"
                    >
                      <p className="font-semibold text-neutral-900 truncate">
                        {cot.cliente_nombre || "Sin nombre"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(cot.fecha_inicio)} → {formatDate(cot.fecha_fin)}
                      </p>
                      {cot.cliente_email ? (
                        <p className="text-xs text-neutral-400 truncate">
                          {cot.cliente_email}
                        </p>
                      ) : null}
                    </Link>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                          Total final
                        </p>
                        <p className="font-semibold text-neutral-900">
                          {formatMoney(cot.total_final)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.pill}`}
                      >
                        <Icon className="h-3.5 w-3.5" weight="fill" />
                        {meta.label}
                      </span>
                      <EliminarCotizacionButton
                        cotizacionId={cot.id}
                        clienteNombre={cot.cliente_nombre}
                        variant="icon"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
