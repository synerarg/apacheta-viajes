import Link from "next/link"

import { PackageCard } from "@/components/dashboard/package-card"
import { createClient } from "@/lib/supabase/server"
import { createPaquetesRepository } from "@/repositories/paquetes/paquetes.repository"

export default async function DashboardPaquetesPage() {
  const supabase = await createClient()
  const paquetesRepo = createPaquetesRepository(supabase)
  const paquetes = await paquetesRepo.findAll()

  const sorted = [...paquetes].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime(),
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-neutral-900">
            Paquetes de Viaje
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Gestiona tus paquetes de viaje.
          </p>
        </div>
        <Link
          href="/dashboard/paquetes/nuevo"
          className="inline-flex self-start sm:self-auto items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 shrink-0"
        >
          + Nuevo Paquete
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-neutral-500 mb-4">No hay paquetes creados aún.</p>
          <Link
            href="/dashboard/paquetes/nuevo"
            className="bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Crear primer paquete
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((paquete) => (
            <PackageCard key={paquete.id} paquete={paquete} />
          ))}
        </div>
      )}
    </div>
  )
}
