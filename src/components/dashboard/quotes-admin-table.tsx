"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowSquareOut } from "@phosphor-icons/react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { QuoteStatus, QuotesRow } from "@/types/quotes/quotes.types"

type OperatorMini = {
  id: string
  usuario_id: string | null
  nombre_comercial: string | null
  nombre: string
}

interface QuotesAdminTableProps {
  cotizaciones: QuotesRow[]
  operadores: OperatorMini[]
}

const ESTADO_LABELS: Record<QuoteStatus, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  archivada: "Archivada",
}

const ESTADO_STYLES: Record<QuoteStatus, string> = {
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

export function QuotesAdminTable({
  cotizaciones,
  operadores,
}: QuotesAdminTableProps) {
  const [operatorFilter, setOperatorFilter] = useState<string>("__all__")
  const [estadoFilter, setEstadoFilter] = useState<string>("__all__")
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")

  // `cotizaciones.operador_id` apunta a `usuarios.id` (auth), no a la PK
  // de `operadores`. Mapeamos por `usuario_id` con fallback al `id` por si
  // algún operador todavía no tiene cuenta vinculada.
  const operatorMap = useMemo(() => {
    const map = new Map<string, OperatorMini>()
    operadores.forEach((operador) =>
      map.set(operador.usuario_id ?? operador.id, operador),
    )
    return map
  }, [operadores])

  const filtered = useMemo(() => {
    return cotizaciones.filter((cot) => {
      if (operatorFilter !== "__all__" && cot.operador_id !== operatorFilter) {
        return false
      }
      if (estadoFilter !== "__all__" && cot.estado !== estadoFilter) {
        return false
      }
      if (desde) {
        const createdAt = new Date(cot.created_at).getTime()
        if (createdAt < new Date(desde).getTime()) return false
      }
      if (hasta) {
        const createdAt = new Date(cot.created_at).getTime()
        const hastaTime = new Date(hasta).getTime() + 86_400_000
        if (createdAt > hastaTime) return false
      }
      return true
    })
  }, [cotizaciones, operatorFilter, estadoFilter, desde, hasta])

  const totales = useMemo(() => {
    return filtered.reduce(
      (acc, cot) => {
        acc.venta += Number(cot.total_venta ?? 0)
        acc.comision += Number(cot.total_comision ?? 0)
        acc.neto += Number(cot.total_neto ?? 0)
        acc.final += Number(cot.total_final ?? 0)
        return acc
      },
      { venta: 0, comision: 0, neto: 0, final: 0 },
    )
  }, [filtered])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 border border-neutral-200 bg-white p-3 sm:p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Operador</Label>
          <Select value={operatorFilter} onValueChange={setOperatorFilter}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos</SelectItem>
              {operadores.map((operador) => (
                <SelectItem
                  key={operador.id}
                  value={operador.usuario_id ?? operador.id}
                >
                  {operador.nombre_comercial ?? operador.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos</SelectItem>
              <SelectItem value="borrador">Borrador</SelectItem>
              <SelectItem value="enviada">Enviada</SelectItem>
              <SelectItem value="archivada">Archivada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="desde">Desde</Label>
          <Input
            id="desde"
            type="date"
            value={desde}
            onChange={(event) => setDesde(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hasta">Hasta</Label>
          <Input
            id="hasta"
            type="date"
            value={hasta}
            onChange={(event) => setHasta(event.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-neutral-200 bg-white -mx-3 sm:mx-0">
        <table className="w-full min-w-[900px] text-xs sm:text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-3 py-2 text-left">Cliente</th>
              <th className="hidden md:table-cell px-3 py-2 text-left">Operador</th>
              <th className="hidden lg:table-cell px-3 py-2 text-left">Fechas viaje</th>
              <th className="hidden md:table-cell px-3 py-2 text-right">Venta</th>
              <th className="hidden lg:table-cell px-3 py-2 text-right">Comisión</th>
              <th className="px-3 py-2 text-right">Total final</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="hidden lg:table-cell px-3 py-2 text-left">Creada</th>
              <th className="px-3 py-2 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-8 text-center text-neutral-500"
                >
                  No hay cotizaciones que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              filtered.map((cot) => {
                const operador = operatorMap.get(cot.operador_id)
                return (
                  <tr key={cot.id} className="border-t border-neutral-100">
                    <td className="px-3 py-2">
                      <div className="font-medium text-neutral-900">
                        {cot.cliente_nombre ?? "—"}
                      </div>
                      {cot.cliente_email ? (
                        <div className="text-xs text-neutral-500">
                          {cot.cliente_email}
                        </div>
                      ) : null}
                    </td>
                    <td className="hidden md:table-cell px-3 py-2 text-neutral-700">
                      {operador?.nombre_comercial ?? operador?.nombre ?? "—"}
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2 text-neutral-700">
                      {formatDate(cot.fecha_inicio)} →{" "}
                      {formatDate(cot.fecha_fin)}
                    </td>
                    <td className="hidden md:table-cell px-3 py-2 text-right tabular-nums">
                      {formatMoney(Number(cot.total_venta ?? 0))}
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2 text-right tabular-nums">
                      {formatMoney(Number(cot.total_comision ?? 0))}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium">
                      {formatMoney(Number(cot.total_final ?? 0))}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium ${
                          ESTADO_STYLES[cot.estado]
                        }`}
                      >
                        {ESTADO_LABELS[cot.estado]}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2 text-neutral-500 text-xs">
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
                )
              })
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot className="bg-neutral-50">
              <tr className="border-t border-neutral-200 text-xs sm:text-sm">
                <td colSpan={1} className="px-3 py-2 text-right font-medium md:hidden">
                  Totales
                </td>
                <td colSpan={3} className="hidden md:table-cell lg:hidden px-3 py-2 text-right font-medium">
                  Totales
                </td>
                <td colSpan={3} className="hidden lg:table-cell px-3 py-2 text-right font-medium">
                  Totales
                </td>
                <td className="hidden md:table-cell px-3 py-2 text-right tabular-nums">
                  {formatMoney(totales.venta)}
                </td>
                <td className="hidden lg:table-cell px-3 py-2 text-right tabular-nums">
                  {formatMoney(totales.comision)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium">
                  {formatMoney(totales.final)}
                </td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <p className="text-xs text-neutral-500">
        {filtered.length} cotizaci{filtered.length === 1 ? "ón" : "ones"} ·
        Neto: {formatMoney(totales.neto)}
      </p>
    </div>
  )
}
