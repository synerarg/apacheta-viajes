import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowSquareOut, CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { deleteExperiencia, updateExperiencia } from "@/app/dashboard/experiencias/actions"
import { DeleteItemButton } from "@/components/dashboard/delete-item-button"
import { ExperienciaForm } from "@/components/dashboard/experiencia-form"
import { adminClient } from "@/lib/supabase/admin-client"

interface EditarExperienciaPageProps {
  params: Promise<{ id: string }>
}

async function getExperienciaWithGallery(id: string) {
  const [{ data: experiencia }, { data: imagenes }] = await Promise.all([
    adminClient.from("experiencias").select("*").eq("id", id).single(),
    adminClient
      .from("experiencias_imagenes")
      .select("url")
      .eq("experiencia_id", id)
      .order("orden"),
  ])
  return { experiencia, gallery: imagenes?.map((i) => i.url) ?? [] }
}

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

async function getDestacadoCount(excludeId: string) {
  const { count } = await adminClient
    .from("experiencias")
    .select("id", { count: "exact", head: true })
    .eq("destacado", true)
    .neq("id", excludeId)
  return count ?? 0
}

export default async function EditarExperienciaPage({ params }: EditarExperienciaPageProps) {
  const { id } = await params
  const [{ experiencia, gallery }, categorias, destinos, destacadoCount] = await Promise.all([
    getExperienciaWithGallery(id),
    getCategorias(),
    getDestinos(),
    getDestacadoCount(id),
  ])

  if (!experiencia) notFound()

  const updateAction = updateExperiencia.bind(null, id)
  const deleteAction = deleteExperiencia.bind(null, id)
  const canToggleDestacado = experiencia.destacado || destacadoCount < 3

  return (
    <div className="min-h-full bg-neutral-50 pb-16">
      <div className="border-b border-neutral-200 bg-white px-8 py-5">
        <Link
          href="/dashboard/experiencias"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a Experiencias
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="font-playfair text-2xl font-bold text-neutral-900">{experiencia.nombre}</h1>
          <div className="flex items-center gap-3">
            <DeleteItemButton action={deleteAction} label="Eliminar experiencia" />
            <Link
              href={`/experiencias/${experiencia.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              <ArrowSquareOut className="h-4 w-4" />
              Ver en la Web
            </Link>
          </div>
        </div>
      </div>

      <div className="px-8 pt-6">
        <ExperienciaForm
          action={updateAction}
          initialData={{
            nombre: experiencia.nombre,
            descripcion: experiencia.descripcion,
            descripcion_corta: experiencia.descripcion_corta,
            activo: experiencia.activo,
            destacado: experiencia.destacado,
            imagen_url: experiencia.imagen_url,
            ubicacion: experiencia.ubicacion,
            categoria_id: experiencia.categoria_id,
            destino_id: experiencia.destino_id,
            duracion_horas: experiencia.duracion_horas,
            precio: experiencia.precio,
            moneda: experiencia.moneda,
            latitud: experiencia.latitud,
            longitud: experiencia.longitud,
            orden: experiencia.orden,
            gallery,
          }}
          categorias={categorias}
          destinos={destinos}
          canToggleDestacado={canToggleDestacado}
          isEdit
        />
      </div>
    </div>
  )
}
