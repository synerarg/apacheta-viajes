import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { createServerExperienceCategoriesController } from "@/controllers/experience-categories/experience-categories.controller"
import { createServerDestinationsController } from "@/controllers/destinations/destinations.controller"
import { createServerPackageCategoriesController } from "@/controllers/package-categories/package-categories.controller"
import { createServerPackagesController } from "@/controllers/packages/packages.controller"
import { createServerPackageDatesController } from "@/controllers/package-dates/package-dates.controller"
import { createServerPackageImagesController } from "@/controllers/package-images/package-images.controller"
import { createServerPackageItineraryController } from "@/controllers/package-itinerary/package-itinerary.controller"
import { PackageView, type PackageViewData } from "@/components/packages/package-view"

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

async function getPackageViewData(slug: string): Promise<PackageViewData | null> {
  const packagesController = await createServerPackagesController()
  const [paquete] = await packagesController.list({
    slug,
    activo: true,
  })

  if (!paquete) {
    return null
  }

  const [
    packagesFechasController,
    packagesItinerarioController,
    packagesImagenesController,
    packagesCategoriasController,
    categoriasExperienceController,
    destinationsController,
  ] = await Promise.all([
    createServerPackageDatesController(),
    createServerPackageItineraryController(),
    createServerPackageImagesController(),
    createServerPackageCategoriesController(),
    createServerExperienceCategoriesController(),
    createServerDestinationsController(),
  ])
  const [fechas, itinerario, imagenes, categoriasRelacionadas, destino] =
    await Promise.all([
      packagesFechasController.list({
        paquete_id: paquete.id,
        activo: true,
      }),
      packagesItinerarioController.list({
        paquete_id: paquete.id,
      }),
      packagesImagenesController.list({
        paquete_id: paquete.id,
      }),
      packagesCategoriasController.list({
        paquete_id: paquete.id,
      }),
      paquete.destino_id
        ? destinationsController.get({
            id: paquete.destino_id,
          })
        : Promise.resolve(null),
    ])

  const categoryIds = categoriasRelacionadas.map((item) => item.categoria_id)
  const categorias = await Promise.all(
    categoryIds.map((categoryId) =>
      categoriasExperienceController.get({
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
    lugar_inicio: paquete.lugar_inicio ?? null,
    incluye_alojamiento: paquete.incluye_alojamiento ?? false,
    incluye_traslado: paquete.incluye_traslado ?? false,
    regimen: paquete.regimen ?? null,
    incluye_guia: paquete.incluye_guia ?? false,
    incluye_entradas: paquete.incluye_entradas ?? false,
    habitaciones: {
      single: fechaPrincipal?.precio_hab_single ?? null,
      doble: fechaPrincipal?.precio_hab_doble ?? null,
      triple: fechaPrincipal?.precio_hab_triple ?? null,
    },
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
    packageFechaId: fechaPrincipal?.id ?? null,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const paquete = await getPackageViewData(slug)

  if (!paquete) {
    return {}
  }

  return {
    title: `${paquete.nombre} | Apacheta Viajes`,
    description: paquete.descripcion_corta,
  }
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params
  const paquete = await getPackageViewData(slug)

  if (!paquete) notFound()

  return <PackageView paquete={paquete} />
}
