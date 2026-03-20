import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowSquareOut, CaretLeft } from "@phosphor-icons/react/dist/ssr"

import { deletePaquete, updatePaquete } from "@/app/dashboard/paquetes/actions"
import { DeleteItemButton } from "@/components/dashboard/delete-item-button"
import { PaqueteForm } from "@/components/dashboard/paquete-form"
import { adminClient } from "@/lib/supabase/admin-client"

interface EditarPaquetePageProps {
  params: Promise<{ id: string }>
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

async function getPaqueteDetails(id: string) {
  const [
    { data: paquete },
    { data: imagenes },
    { data: categorias },
    { data: fechas },
    { data: itinerario },
  ] = await Promise.all([
    adminClient.from("paquetes").select("*").eq("id", id).single(),
    adminClient
      .from("paquetes_imagenes")
      .select("url")
      .eq("paquete_id", id)
      .order("orden"),
    adminClient
      .from("paquetes_categorias")
      .select("categoria_id")
      .eq("paquete_id", id),
    adminClient
      .from("paquetes_fechas")
      .select("*")
      .eq("paquete_id", id)
      .order("fecha_inicio"),
    adminClient
      .from("paquetes_itinerario")
      .select("*")
      .eq("paquete_id", id)
      .order("dia_numero"),
  ])

  return {
    paquete,
    gallery: imagenes?.map((imagen) => imagen.url) ?? [],
    categoriaIds: categorias?.map((categoria) => categoria.categoria_id) ?? [],
    fechas: fechas ?? [],
    itinerario: itinerario ?? [],
  }
}

async function getDestacadoCount(excludeId: string) {
  const { count } = await adminClient
    .from("paquetes")
    .select("id", { count: "exact", head: true })
    .eq("destacado", true)
    .neq("id", excludeId)
  return count ?? 0
}

export default async function EditarPaquetePage({ params }: EditarPaquetePageProps) {
  const { id } = await params
  const [{ paquete, gallery, categoriaIds, fechas, itinerario }, categorias, destinos, destacadoCount] =
    await Promise.all([
    getPaqueteDetails(id),
    getCategorias(),
    getDestinos(),
    getDestacadoCount(id),
  ])

  if (!paquete) notFound()

  const updateAction = updatePaquete.bind(null, id)
  const deleteAction = deletePaquete.bind(null, id)
  const canToggleDestacado = paquete.destacado || destacadoCount < 3

  return (
    <div className="min-h-full bg-neutral-50 pb-16">
      <div className="border-b border-neutral-200 bg-white px-8 py-5">
        <Link
          href="/dashboard/paquetes"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a Paquetes
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="font-playfair text-2xl font-bold text-neutral-900">{paquete.nombre}</h1>
          <div className="flex items-center gap-3">
            <DeleteItemButton action={deleteAction} label="Eliminar paquete" />
            <Link
              href={`/paquetes/${paquete.slug}`}
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
        <PaqueteForm
          action={updateAction}
          initialData={{
            nombre: paquete.nombre,
            descripcion_corta: paquete.descripcion_corta,
            descripcion: paquete.descripcion,
            activo: paquete.activo,
            destacado: paquete.destacado,
            imagen_url: paquete.imagen_url,
            duracion_dias: paquete.duracion_dias,
            precio_desde: paquete.precio_desde,
            moneda: paquete.moneda,
            destino_id: paquete.destino_id,
            orden: paquete.orden,
            incluye_alojamiento: paquete.incluye_alojamiento,
            incluye_traslado: paquete.incluye_traslado,
            incluye_comidas: paquete.incluye_comidas,
            incluye_guia: paquete.incluye_guia,
            incluye_entradas: paquete.incluye_entradas,
            categoria_ids: categoriaIds,
            fechas,
            itinerario,
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
