import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { createExperiencia } from "@/app/dashboard/experiencias/actions"
import { ExperienciaForm } from "@/components/dashboard/experiencia-form"
import { adminClient } from "@/lib/supabase/admin-client"

async function getCategorias() {
  const { data } = await adminClient
    .from("categorias_experiencia")
    .select("*")
    .eq("activo", true)
    .order("orden")
  return data ?? []
}

async function getDestinos() {
  const { data } = await adminClient
    .from("destinos")
    .select("*")
    .eq("activo", true)
    .order("nombre")

  return data ?? []
}

async function getDestacadoCount() {
  const { count } = await adminClient
    .from("experiencias")
    .select("id", { count: "exact", head: true })
    .eq("destacado", true)
  return count ?? 0
}

export default async function NuevaExperienciaPage() {
  const [categorias, destinos, destacadoCount] = await Promise.all([
    getCategorias(),
    getDestinos(),
    getDestacadoCount(),
  ])

  return (
    <div className="min-h-full bg-neutral-50 pb-16">
      <div className="border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <Link
          href="/dashboard/experiencias"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a Experiencias
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="font-playfair text-xl sm:text-2xl font-bold text-neutral-900">Nueva Experiencia</h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <ExperienciaForm
          action={createExperiencia}
          categorias={categorias}
          destinos={destinos}
          canToggleDestacado={destacadoCount < 3}
        />
      </div>
    </div>
  )
}
