import Link from "next/link"

import { TrasladoCard } from "@/components/dashboard/traslado-card"
import { createClient } from "@/lib/supabase/server"
import { createTrasladosRepository } from "@/repositories/traslados/traslados.repository"

export default async function DashboardTrasladosPage() {
  const supabase = await createClient()
  const trasladosRepo = createTrasladosRepository(supabase)
  const traslados = await trasladosRepo.findAll()

  const sorted = [...traslados].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime(),
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
            Traslados
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Gestiona los traslados disponibles.
          </p>
        </div>
        <Link
          href="/dashboard/traslados/nuevo"
          className="inline-flex self-start sm:self-auto items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 shrink-0"
        >
          + Nuevo Traslado
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-neutral-500 mb-4">No hay traslados creados aún.</p>
          <Link
            href="/dashboard/traslados/nuevo"
            className="bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Crear primer traslado
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((traslado) => (
            <TrasladoCard key={traslado.id} traslado={traslado} />
          ))}
        </div>
      )}
    </div>
  )
}
