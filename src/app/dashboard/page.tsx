import Link from "next/link"
import { Suitcase, Star } from "@phosphor-icons/react/dist/ssr"
import { ArrowRight } from "lucide-react"

import { StatsCard } from "@/components/dashboard/stats-card"
import {
  RecentItemsList,
  type RecentItem,
} from "@/components/dashboard/recent-items-list"
import { createClient } from "@/lib/supabase/server"
import { createPaquetesRepository } from "@/repositories/paquetes/paquetes.repository"
import { createExperienciasRepository } from "@/repositories/experiencias/experiencias.repository"

export default async function DashboardPage() {
  const supabase = await createClient()

  const paquetesRepo = createPaquetesRepository(supabase)
  const experienciasRepo = createExperienciasRepository(supabase)

  const [paquetes, experiencias] = await Promise.all([
    paquetesRepo.findAll(),
    experienciasRepo.findAll(),
  ])

  const paquetesActivos = paquetes.filter((p) => p.activo).length
  const paquetesBorradores = paquetes.length - paquetesActivos
  const experienciasActivas = experiencias.filter((e) => e.activo).length
  const experienciasBorradores = experiencias.length - experienciasActivas

  const recentPaquetes: RecentItem[] = paquetes
    .sort((a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime(),
    )
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      tipo: "Paquete",
      activo: p.activo,
      imagen_url: p.imagen_url,
      created_at: p.created_at,
      editHref: `/dashboard/paquetes/${p.id}/editar`,
    }))

  const recentExperiencias: RecentItem[] = experiencias
    .sort((a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime(),
    )
    .slice(0, 5)
    .map((e) => ({
      id: e.id,
      nombre: e.nombre,
      tipo: "Experiencia",
      activo: e.activo,
      imagen_url: e.imagen_url,
      created_at: e.created_at,
      editHref: `/dashboard/experiencias/${e.id}/editar`,
    }))

  const recentItems = [...recentPaquetes, ...recentExperiencias]
    .sort((a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime(),
    )
    .slice(0, 8)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-neutral-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Gestiona tus paquetes de viaje y eventos de golf.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatsCard
          icon={<Suitcase className="h-6 w-6" />}
          label="Paquetes de viaje"
          sublabel={`${paquetesActivos} publicados, ${paquetesBorradores} borradores`}
          value={paquetes.length}
        />
        <StatsCard
          icon={<Star className="h-6 w-6" />}
          label="Experiencias"
          sublabel={`${experienciasActivas} publicados, ${experienciasBorradores} borradores`}
          value={experiencias.length}
        />
      </div>

      {/* Recent items */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-playfair text-xl font-semibold text-primary">
            Últimos Agregados
          </h2>
          <div className="flex gap-4 text-xs text-neutral-500">
            <Link href="/dashboard/paquetes" className="flex items-center gap-1 hover:text-primary">
              Ver paquetes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/dashboard/experiencias" className="flex items-center gap-1 hover:text-primary">
              Ver experiencias <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        <RecentItemsList items={recentItems} />
      </div>
    </div>
  )
}
