import Link from "next/link"
import { Plus } from "@phosphor-icons/react/dist/ssr"

import { Card, CardContent } from "@/components/ui/card"
import { createServerOperatorTypesController } from "@/controllers/operator-types/operator-types.controller"

export const dynamic = "force-dynamic"

function formatPct(value: number | null | undefined) {
  if (value === null || value === undefined) return "—"
  const n = Number(value)
  if (!Number.isFinite(n)) return "—"
  return `${n.toFixed(2).replace(/\.?0+$/, "")}%`
}

export default async function OperatorTypesPage() {
  const controller = await createServerOperatorTypesController()
  const tipos = await controller.listOrdered()

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900">
            Tipos de operador
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 max-w-2xl">
            Definí los tipos disponibles y la comisión que aplica a cada uno. Los
            postulantes eligen un tipo al enviar su solicitud y se mantiene al
            aprobar el alta.
          </p>
        </div>
        <Link
          href="/dashboard/operadores/tipos/nuevo"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" weight="bold" />
          Nuevo tipo
        </Link>
      </header>

      {tipos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Todavía no hay tipos cargados. Creá el primero.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Comisión</th>
                <th className="px-4 py-3 text-left font-medium">Orden</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {tipos.map((tipo) => (
                <tr key={tipo.id} className="hover:bg-neutral-50/60">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {tipo.nombre}
                    {tipo.descripcion ? (
                      <p className="text-xs font-normal text-neutral-500 mt-0.5 line-clamp-1">
                        {tipo.descripcion}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-neutral-700 tabular-nums">
                    {formatPct(tipo.comision_pct)}
                  </td>
                  <td className="px-4 py-3 text-neutral-700 tabular-nums">
                    {tipo.orden}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tipo.activo
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {tipo.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/operadores/tipos/${tipo.id}/editar`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
