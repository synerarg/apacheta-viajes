import type { Metadata } from "next"
import { CatalogoExperiencias } from "@/components/experiencias/catalogo-experiencias"
import { getExperiencesCatalogData } from "@/lib/storefront/storefront.server"

export const metadata: Metadata = {
  title: "Experiencias | Apacheta Viajes",
  description:
    "Experiencias únicas en el Norte Argentino: cultura andina, trekking, vinos de altura, safaris fotográficos y más.",
}

interface ExperienciasPageProps {
  searchParams: Promise<{
    categoria?: string
  }>
}

export default async function ExperienciasPage({
  searchParams,
}: ExperienciasPageProps) {
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
    <CatalogoExperiencias
      experiencias={items}
      categorias={categories}
      initialCategoria={initialCategoria}
    />
  )
}
