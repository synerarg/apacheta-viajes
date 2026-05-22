import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { createServerExperienceCategoriesController } from "@/controllers/experience-categories/experience-categories.controller"
import { createServerDestinationsController } from "@/controllers/destinations/destinations.controller"
import { createServerExperiencesController } from "@/controllers/experiences/experiences.controller"
import { createServerExperienceImagesController } from "@/controllers/experience-images/experience-images.controller"
import {
  ExperienceView,
  type ExperienceViewData,
} from "@/components/experiences/experience-view"

interface Props {
  params: Promise<{ slug: string }>
}

async function getExperienceViewData(
  slug: string,
): Promise<ExperienceViewData | null> {
  const experiencesController = await createServerExperiencesController()
  const [experiencia] = await experiencesController.list({
    slug,
    activo: true,
  })

  if (!experiencia) {
    return null
  }

  const [
    experiencesImagenesController,
    categoriasExperienceController,
    destinationsController,
  ] = await Promise.all([
    createServerExperienceImagesController(),
    createServerExperienceCategoriesController(),
    createServerDestinationsController(),
  ])
  const [imagenes, categoria, destino] = await Promise.all([
    experiencesImagenesController.list({
      experiencia_id: experiencia.id,
    }),
    experiencia.categoria_id
      ? categoriasExperienceController.get({
          id: experiencia.categoria_id,
        })
      : Promise.resolve(null),
    experiencia.destino_id
      ? destinationsController.get({
          id: experiencia.destino_id,
        })
      : Promise.resolve(null),
  ])
  const galeria = [
    experiencia.imagen_url,
    ...imagenes
      .sort((leftImage, rightImage) => (leftImage.orden ?? 0) - (rightImage.orden ?? 0))
      .map((image) => image.url),
  ].filter((image): image is string => Boolean(image))

  return {
    id: experiencia.id,
    nombre: experiencia.nombre,
    descripcion: experiencia.descripcion ?? "",
    descripcion_corta: experiencia.descripcion_corta ?? "",
    duracion_horas: Number(experiencia.duracion_horas ?? 0),
    precio: Number(experiencia.precio ?? 0),
    moneda: experiencia.moneda ?? "ARS",
    imagen_url: experiencia.imagen_url ?? galeria[0] ?? "",
    ubicacion:
      experiencia.ubicacion ??
      [destino?.nombre, destino?.provincia].filter(Boolean).join(", "),
    origen: experiencia.origen ?? null,
    latitud: Number(experiencia.latitud ?? destino?.latitud ?? -24.7859),
    longitud: Number(experiencia.longitud ?? destino?.longitud ?? -65.4117),
    categoria: categoria?.nombre ?? "Experiencia",
    galeria,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const experiencia = await getExperienceViewData(slug)

  if (!experiencia) {
    return {}
  }

  return {
    title: `${experiencia.nombre} | Apacheta Viajes`,
    description: experiencia.descripcion_corta,
  }
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params
  const experiencia = await getExperienceViewData(slug)

  if (!experiencia) notFound()

  return <ExperienceView experiencia={experiencia} />
}
