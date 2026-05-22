import type { Metadata } from "next"
import { CatalogExperiences } from "@/components/experiences/catalog-experiences"
import { getExperiencesCatalogData } from "@/lib/storefront/storefront.server"

export const metadata: Metadata = {
  title: "Experiencias | Apacheta Viajes",
  description:
    "Experiencias únicas en el Norte Argentino: cultura andina, trekking, vinos de altura, safaris fotográficos y más.",
}

interface ExperiencesPageProps {
  searchParams: Promise<{
    categoria?: string
  }>
}

export default async function ExperiencesPage({
  searchParams,
}: ExperiencesPageProps) {
  const [{ items, categories }, resolvedSearchParams] = await Promise.all([
    getExperiencesCatalogData(),
    searchParams,
  ])
  const initialCategoria =
    resolvedSearchParams.categoria &&
    categories.includes(resolvedSearchParams.categoria)
      ? resolvedSearchParams.categoria
      : "Todos"

  return (
    <CatalogExperiences
      experiencias={items}
      categorias={categories}
      initialCategoria={initialCategoria}
    />
  )
}
