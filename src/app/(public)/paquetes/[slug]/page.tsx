import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { createServerCategoriasExperienciaController } from "@/controllers/categorias-experiencia/categorias-experiencia.controller"
import { createServerDestinosController } from "@/controllers/destinos/destinos.controller"
import { createServerPaquetesCategoriasController } from "@/controllers/paquetes-categorias/paquetes-categorias.controller"
import { createServerPaquetesController } from "@/controllers/paquetes/paquetes.controller"
import { createServerPaquetesFechasController } from "@/controllers/paquetes-fechas/paquetes-fechas.controller"
import { createServerPaquetesImagenesController } from "@/controllers/paquetes-imagenes/paquetes-imagenes.controller"
import { createServerPaquetesItinerarioController } from "@/controllers/paquetes-itinerario/paquetes-itinerario.controller"
import { PaqueteView, type PaqueteViewData } from "@/components/paquetes/paquete-view"

interface Props {
  params: Promise<{ slug: string }>
}

function formatDateLabel(dateValue: string) {
  const formatted = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${dateValue}T00:00:00`))

  return formatted.replace(".", "").replace(/^\w/, (letter) => letter.toUpperCase())
}

function formatDateRange(startDate: string, endDate: string) {
  return `${formatDateLabel(startDate)} — ${formatDateLabel(endDate)}`
}

async function getPaqueteViewData(slug: string): Promise<PaqueteViewData | null> {
  const paquetesController = await createServerPaquetesController()
  const [paquete] = await paquetesController.list({
    slug,
    activo: true,
  })

  if (!paquete) {
    return null
  }

  const [
    paquetesFechasController,
    paquetesItinerarioController,
    paquetesImagenesController,
    paquetesCategoriasController,
    categoriasExperienciaController,
    destinosController,
  ] = await Promise.all([
    createServerPaquetesFechasController(),
    createServerPaquetesItinerarioController(),
    createServerPaquetesImagenesController(),
    createServerPaquetesCategoriasController(),
    createServerCategoriasExperienciaController(),
    createServerDestinosController(),
  ])
  const [fechas, itinerario, imagenes, categoriasRelacionadas, destino] =
    await Promise.all([
      paquetesFechasController.list({
        paquete_id: paquete.id,
        activo: true,
      }),
      paquetesItinerarioController.list({
        paquete_id: paquete.id,
      }),
      paquetesImagenesController.list({
        paquete_id: paquete.id,
      }),
      paquetesCategoriasController.list({
        paquete_id: paquete.id,
      }),
      paquete.destino_id
        ? destinosController.get({
            id: paquete.destino_id,
          })
        : Promise.resolve(null),
    ])

  const categoryIds = categoriasRelacionadas.map((item) => item.categoria_id)
  const categorias = await Promise.all(
    categoryIds.map((categoryId) =>
      categoriasExperienciaController.get({
        id: categoryId,
      }),
    ),
  )
  const categoria = categorias.find(Boolean)?.nombre ?? "Paquete"
  const fechaPrincipal = [...fechas].sort((leftDate, rightDate) =>
    leftDate.fecha_inicio.localeCompare(rightDate.fecha_inicio),
  )[0]
  const galeria = [
    paquete.imagen_url,
    ...imagenes
      .sort((leftImage, rightImage) => (leftImage.orden ?? 0) - (rightImage.orden ?? 0))
      .map((image) => image.url),
  ].filter((image): image is string => Boolean(image))

  return {
    id: paquete.id,
    nombre: paquete.nombre,
    descripcion_corta: paquete.descripcion_corta ?? "",
    duracion_dias: paquete.duracion_dias,
    precio_desde: fechaPrincipal?.precio_por_persona ?? paquete.precio_desde,
    moneda: fechaPrincipal?.moneda ?? paquete.moneda ?? "ARS",
    imagen_url: paquete.imagen_url ?? galeria[0] ?? "",
    incluye_alojamiento: paquete.incluye_alojamiento ?? false,
    incluye_traslado: paquete.incluye_traslado ?? false,
    incluye_comidas: paquete.incluye_comidas ?? false,
    incluye_guia: paquete.incluye_guia ?? false,
    incluye_entradas: paquete.incluye_entradas ?? false,
    categoria,
    fecha_salida: fechaPrincipal
      ? formatDateRange(fechaPrincipal.fecha_inicio, fechaPrincipal.fecha_fin)
      : undefined,
    itinerario: itinerario
      .sort((leftDay, rightDay) => leftDay.dia_numero - rightDay.dia_numero)
      .map((item) => ({
        dia: item.dia_numero,
        titulo: item.titulo,
        descripcion: item.descripcion,
      })),
    galeria,
    ubicacion: destino
      ? [destino.nombre, destino.provincia].filter(Boolean).join(", ")
      : "Salta & Jujuy, Argentina",
    latitud: Number(destino?.latitud ?? -24.7859),
    longitud: Number(destino?.longitud ?? -65.4117),
    paqueteFechaId: fechaPrincipal?.id ?? null,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const paquete = await getPaqueteViewData(slug)

  if (!paquete) {
    return {}
  }

  return {
    title: `${paquete.nombre} | Apacheta Viajes`,
    description: paquete.descripcion_corta,
  }
}

export default async function PaqueteDetailPage({ params }: Props) {
  const { slug } = await params
  const paquete = await getPaqueteViewData(slug)

  if (!paquete) notFound()

  return <PaqueteView paquete={paquete} />
}
