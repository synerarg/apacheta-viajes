import Link from "next/link"
import { notFound } from "next/navigation"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

import {
  deleteTraslado,
  updateTraslado,
  type TarifaFormItem,
} from "@/app/dashboard/traslados/actions"
import { DeleteItemButton } from "@/components/dashboard/delete-item-button"
import { TrasladoForm } from "@/components/dashboard/traslado-form"
import { adminClient } from "@/lib/supabase/admin-client"
import type { Moneda } from "@/types/shared/enums"

interface EditarTrasladoPageProps {
  params: Promise<{ id: string }>
}

async function getTrasladoData(id: string) {
  const [
    { data: traslado },
    { data: imagenes },
    { data: tarifas },
  ] = await Promise.all([
    adminClient.from("traslados").select("*").eq("id", id).single(),
    adminClient
      .from("traslados_imagenes")
      .select("url")
      .eq("traslado_id", id)
      .order("orden"),
    adminClient
      .from("traslados_tarifas")
      .select("*")
      .eq("traslado_id", id)
      .order("orden"),
  ])

  return {
    traslado,
    gallery: imagenes?.map((image) => image.url) ?? [],
    tarifas: (tarifas ?? []) as Array<{
      id: string
      vigencia_label: string | null
      vigencia_desde: string | null
      vigencia_hasta: string | null
      precio_adulto: number | null
      precio_nino: number | null
      moneda: Moneda | null
      comision_pct: number | null
      notas: string | null
    }>,
  }
}

async function getDestinos() {
  const { data } = await adminClient
    .from("destinos")
    .select("*")
    .eq("activo", true)
    .order("nombre")

  return data ?? []
}

export default async function EditarTrasladoPage({
  params,
}: EditarTrasladoPageProps) {
  const { id } = await params
  const [{ traslado, gallery, tarifas }, destinos] = await Promise.all([
    getTrasladoData(id),
    getDestinos(),
  ])

  if (!traslado) notFound()

  const updateAction = updateTraslado.bind(null, id)
  const deleteAction = deleteTraslado.bind(null, id)

  const tarifasIniciales: TarifaFormItem[] = tarifas.map((tarifa) => ({
    id: tarifa.id,
    vigencia_label: tarifa.vigencia_label,
    vigencia_desde: tarifa.vigencia_desde,
    vigencia_hasta: tarifa.vigencia_hasta,
    precio_adulto: tarifa.precio_adulto,
    precio_nino: tarifa.precio_nino,
    moneda: (tarifa.moneda ?? "ARS") as Moneda,
    comision_pct: tarifa.comision_pct,
    notas: tarifa.notas,
  }))

  return (
    <div className="min-h-full bg-neutral-50 pb-16">
      <div className="border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <Link
          href="/dashboard/traslados"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CaretLeft className="h-3.5 w-3.5" />
          Volver a Traslados
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-playfair text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
            {traslado.nombre}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <DeleteItemButton
              action={deleteAction}
              label="Eliminar traslado"
              redirectTo="/dashboard/traslados"
            />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <TrasladoForm
          action={updateAction}
          initialData={{
            nombre: traslado.nombre,
            descripcion: traslado.descripcion,
            descripcion_corta: traslado.descripcion_corta,
            origen: traslado.origen,
            destino: traslado.destino,
            tipo_servicio: traslado.tipo_servicio,
            modalidad: traslado.modalidad,
            vehiculo_tipo: traslado.vehiculo_tipo,
            capacidad_max: traslado.capacidad_max,
            base_minima_pax: traslado.base_minima_pax,
            precio_desde: traslado.precio_desde,
            moneda: traslado.moneda,
            duracion_minutos: traslado.duracion_minutos,
            incluye_equipaje: traslado.incluye_equipaje,
            incluye_iva: traslado.incluye_iva,
            impuestos_adicionales_pct: traslado.impuestos_adicionales_pct,
            imagen_url: traslado.imagen_url,
            destino_id: traslado.destino_id,
            activo: traslado.activo,
            destacado: traslado.destacado,
            orden: traslado.orden,
            gallery,
          }}
          destinos={destinos}
          tarifasIniciales={tarifasIniciales}
          isEdit
        />
      </div>
    </div>
  )
}
