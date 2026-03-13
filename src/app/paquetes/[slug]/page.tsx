import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { paquetesMock } from "@/lib/mock-data/paquetes"
import { PaqueteView } from "@/components/paquetes/paquete-view"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return paquetesMock.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const paquete = paquetesMock.find((p) => p.slug === slug)
  if (!paquete) return {}
  return {
    title: `${paquete.nombre} | Apacheta Viajes`,
    description: paquete.descripcion_corta,
  }
}

export default async function PaqueteDetailPage({ params }: Props) {
  const { slug } = await params
  const paquete = paquetesMock.find((p) => p.slug === slug)

  if (!paquete) notFound()

  return <PaqueteView paquete={paquete} />
}
