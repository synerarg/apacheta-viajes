import Link from "next/link"

import { ExperienceCard } from "@/components/dashboard/experience-card"
import { createClient } from "@/lib/supabase/server"
import { createExperienciasRepository } from "@/repositories/experiencias/experiencias.repository"

export default async function DashboardExperienciasPage() {
  const supabase = await createClient()
  const experienciasRepo = createExperienciasRepository(supabase)
  const experiencias = await experienciasRepo.findAll()

  const sorted = [...experiencias].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime(),
  )

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-neutral-900">
            Experiencias
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Gestiona tus experiencias.
          </p>
        </div>
        <Link
          href="/dashboard/experiencias/nueva"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          + Nueva Experiencia
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-neutral-500 mb-4">No hay experiencias creadas aún.</p>
          <Link
            href="/dashboard/experiencias/nueva"
            className="bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Crear primera experiencia
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((experiencia) => (
            <ExperienceCard key={experiencia.id} experiencia={experiencia} />
          ))}
        </div>
      )}
    </div>
  )
}
