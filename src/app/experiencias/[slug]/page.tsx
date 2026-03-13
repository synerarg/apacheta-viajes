import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { experienciasMock } from "@/lib/mock-data/experiencias"
import { ExperienciaView } from "@/components/experiencias/experiencia-view"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return experienciasMock.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const experiencia = experienciasMock.find((e) => e.slug === slug)
  if (!experiencia) return {}
  return {
    title: `${experiencia.nombre} | Apacheta Viajes`,
    description: experiencia.descripcion_corta,
  }
}

export default async function ExperienciaDetailPage({ params }: Props) {
  const { slug } = await params
  const experiencia = experienciasMock.find((e) => e.slug === slug)

  if (!experiencia) notFound()

  return <ExperienciaView experiencia={experiencia} />
}
