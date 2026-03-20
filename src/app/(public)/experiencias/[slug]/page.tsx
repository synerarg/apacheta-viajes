import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { createServerCategoriasExperienciaController } from "@/controllers/categorias-experiencia/categorias-experiencia.controller"
import { createServerDestinosController } from "@/controllers/destinos/destinos.controller"
import { createServerExperienciasController } from "@/controllers/experiencias/experiencias.controller"
import { createServerExperienciasImagenesController } from "@/controllers/experiencias-imagenes/experiencias-imagenes.controller"
import {
  ExperienciaView,
  type ExperienciaViewData,
} from "@/components/experiencias/experiencia-view"

interface Props {
  params: Promise<{ slug: string }>
}

async function getExperienciaViewData(
  slug: string,
): Promise<ExperienciaViewData | null> {
  const experienciasController = await createServerExperienciasController()
  const [experiencia] = await experienciasController.list({
    slug,
    activo: true,
  })

  if (!experiencia) {
    return null
  }

  const [
    experienciasImagenesController,
    categoriasExperienciaController,
    destinosController,
  ] = await Promise.all([
    createServerExperienciasImagenesController(),
    createServerCategoriasExperienciaController(),
    createServerDestinosController(),
  ])
  const [imagenes, categoria, destino] = await Promise.all([
    experienciasImagenesController.list({
      experiencia_id: experiencia.id,
    }),
    experiencia.categoria_id
      ? categoriasExperienciaController.get({
          id: experiencia.categoria_id,
        })
      : Promise.resolve(null),
    experiencia.destino_id
      ? destinosController.get({
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
    latitud: Number(experiencia.latitud ?? destino?.latitud ?? -24.7859),
    longitud: Number(experiencia.longitud ?? destino?.longitud ?? -65.4117),
    categoria: categoria?.nombre ?? "Experiencia",
    galeria,
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const experiencia = await getExperienciaViewData(slug)

  if (!experiencia) {
    return {}
  }

  return {
    title: `${experiencia.nombre} | Apacheta Viajes`,
    description: experiencia.descripcion_corta,
  }
}

export default async function ExperienciaDetailPage({ params }: Props) {
  const { slug } = await params
  const experiencia = await getExperienciaViewData(slug)

  if (!experiencia) notFound()

  return <ExperienciaView experiencia={experiencia} />
}
