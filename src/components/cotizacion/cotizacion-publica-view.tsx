import Image from "next/image"
import { EnvelopeSimple, Phone, Lightbulb } from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent } from "@/components/ui/card"

export type CotizacionPublicaItem = {
  id: string
  dia_offset: number
  fecha: string | null
  servicio_nombre: string
  servicio_descripcion: string | null
  adultos: number
  menores: number
  subtotal_venta: number
  is_special: boolean | null
  orden: number | null
}

export type CotizacionPublicaData = {
  id: string
  token: string
  cliente_nombre: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  total_venta: number
  total_impuesto: number
  total_final: number
  aplica_impuesto: boolean | null
  impuesto_pct: number
  recomendaciones: string[] | null
  estado: "borrador" | "enviada" | "archivada"
  items: CotizacionPublicaItem[]
  operador: {
    nombre: string | null
    email: string | null
    telefono: string | null
  }
}

function formatDate(iso: string | null) {
  if (!iso) return ""
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatShort(iso: string | null) {
  if (!iso) return ""
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatMoney(v: number) {
  return `$${Math.round(v || 0).toLocaleString("es-AR")}`
}

function daysBetween(start: string | null, end: string | null): string[] {
  if (!start || !end) return []
  const s = new Date(start + "T00:00:00")
  const e = new Date(end + "T00:00:00")
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return []
  const out: string[] = []
  const cur = new Date(s)
  while (cur <= e) {
    out.push(cur.toISOString().slice(0, 10))
    cur.setDate(cur.getDate() + 1)
  }
  return out
}

export function CotizacionPublicaView({ data }: { data: CotizacionPublicaData }) {
  const days = daysBetween(data.fecha_inicio, data.fecha_fin)

  const itemsByDay = new Map<number, CotizacionPublicaItem[]>()
  for (const it of data.items) {
    const arr = itemsByDay.get(it.dia_offset) ?? []
    arr.push(it)
    itemsByDay.set(it.dia_offset, arr)
  }
  for (const [k, arr] of itemsByDay) {
    arr.sort(
      (a, b) =>
        (a.orden ?? 999) - (b.orden ?? 999) ||
        a.servicio_nombre.localeCompare(b.servicio_nombre),
    )
    itemsByDay.set(k, arr)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <header className="bg-[#2E2726] text-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 space-y-4">
          <Image
            src="/logo.png"
            alt="Apacheta Viajes"
            width={160}
            height={60}
            className="h-auto w-auto brightness-0 invert"
          />
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-white/60">
              Cotización personalizada
            </p>
            <h1 className="font-playfair text-2xl sm:text-4xl font-bold">
              {data.cliente_nombre || "Tu viaje al Norte Argentino"}
            </h1>
            {data.fecha_inicio && data.fecha_fin ? (
              <p className="text-sm text-white/80 capitalize">
                {formatShort(data.fecha_inicio)} → {formatShort(data.fecha_fin)}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10 space-y-6">
        {/* Días */}
        {days.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-neutral-500">
              Itinerario en preparación.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {days.map((fecha, i) => {
              const items = itemsByDay.get(i) ?? []
              return (
                <Card key={`${i}-${fecha}`}>
                  <CardContent className="space-y-4 py-5">
                    <div className="flex items-baseline justify-between gap-3 border-b border-neutral-100 pb-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                          Día {i + 1}
                        </p>
                        <h2 className="font-playfair text-lg font-semibold text-neutral-900 capitalize">
                          {formatDate(fecha)}
                        </h2>
                      </div>
                    </div>

                    {items.length === 0 ? (
                      <p className="text-xs italic text-neutral-400">
                        Día libre.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {items.map((it) => (
                          <div
                            key={it.id}
                            className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"
                          >
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-sm text-neutral-900">
                                {it.servicio_nombre}
                              </h3>
                              {it.servicio_descripcion ? (
                                <p className="text-xs text-neutral-500 mt-0.5">
                                  {it.servicio_descripcion}
                                </p>
                              ) : null}
                              {!it.is_special ? (
                                <p className="text-[11px] text-neutral-400 mt-1">
                                  {it.adultos} adulto{it.adultos === 1 ? "" : "s"}
                                  {it.menores > 0
                                    ? ` · ${it.menores} menor${it.menores === 1 ? "" : "es"}`
                                    : ""}
                                </p>
                              ) : null}
                            </div>
                            <p className="text-sm font-semibold text-neutral-900 whitespace-nowrap">
                              {formatMoney(it.subtotal_venta)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Total */}
        <Card>
          <CardContent className="py-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="text-neutral-900">
                {formatMoney(data.total_venta)}
              </span>
            </div>
            {data.aplica_impuesto ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">
                  Impuesto ({data.impuesto_pct}%)
                </span>
                <span className="text-neutral-900">
                  {formatMoney(data.total_impuesto)}
                </span>
              </div>
            ) : null}
            <div className="border-t border-neutral-200 pt-3 flex items-center justify-between">
              <span className="font-semibold text-neutral-900">
                Total final
              </span>
              <span className="font-bold text-lg sm:text-xl text-neutral-900">
                {formatMoney(data.total_final)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones */}
        {data.recomendaciones && data.recomendaciones.length > 0 ? (
          <Card>
            <CardContent className="py-5 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" weight="fill" />
                <h3 className="font-semibold text-sm text-neutral-900">
                  Recomendaciones del operador
                </h3>
              </div>
              <ul className="space-y-1.5">
                {data.recomendaciones.map((rec, i) => (
                  <li
                    key={i}
                    className="text-sm text-neutral-700 leading-relaxed"
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        {/* Operador CTA */}
        <Card>
          <CardContent className="py-5 space-y-3">
            <h3 className="font-semibold text-sm text-neutral-900">
              ¿Te interesa esta propuesta?
            </h3>
            <p className="text-xs text-neutral-500">
              Contactá al operador para confirmar fechas y reservar.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.operador.telefono ? (
                <a
                  href={`tel:${data.operador.telefono}`}
                  className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {data.operador.telefono}
                </a>
              ) : null}
              {data.operador.email ? (
                <a
                  href={`mailto:${data.operador.email}`}
                  className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-100 transition-colors"
                >
                  <EnvelopeSimple className="h-3.5 w-3.5" />
                  {data.operador.email}
                </a>
              ) : null}
            </div>
            {data.operador.nombre ? (
              <p className="text-[11px] text-neutral-400 pt-1">
                Atendido por {data.operador.nombre}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-[11px] text-neutral-400">
          Cotización generada por Apacheta Viajes · Operador turístico boutique del Norte Argentino
        </div>
      </footer>
    </div>
  )
}
