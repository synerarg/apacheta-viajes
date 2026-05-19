import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { createServerCotizacionesController } from "@/controllers/cotizaciones/cotizaciones.controller"
import type { CotizacionesRow } from "@/types/cotizaciones/cotizaciones.types"

export const dynamic = "force-dynamic"

const TABS = [
  { key: "borrador", label: "Borradores" },
  { key: "enviada", label: "Enviadas" },
  { key: "archivada", label: "Archivadas" },
] as const

type TabKey = (typeof TABS)[number]["key"]

const estadoStyles: Record<CotizacionesRow["estado"], string> = {
  borrador: "bg-amber-100 text-amber-800",
  enviada: "bg-emerald-100 text-emerald-800",
  archivada: "bg-neutral-200 text-neutral-700",
}

const estadoLabels: Record<CotizacionesRow["estado"], string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  archivada: "Archivada",
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
  const cotizaciones: CotizacionesRow[] = all.filter((c) => c.estado === activeTab)

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

      <nav className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/operador?estado=${tab.key}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
          </Link>
        ))}
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
          {cotizaciones.map((cot) => (
            <Link
              key={cot.id}
              href={`/operador/cotizaciones/${cot.id}`}
              className="block"
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
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
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Total final
                      </p>
                      <p className="font-semibold text-neutral-900">
                        {formatMoney(cot.total_final)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        estadoStyles[cot.estado]
                      }`}
                    >
                      {estadoLabels[cot.estado]}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
