import type { Metadata } from "next"
import { CatalogPackages } from "@/components/packages/catalog-packages"
import { getPackagesCatalogData } from "@/lib/storefront/storefront.server"

export const metadata: Metadata = {
  title: "Paquetes nacionales | Apacheta Viajes",
  description:
    "Circuitos y paquetes turísticos por el Norte Argentino. Valles Calchaquíes, Puna, Quebrada de Humahuaca y más.",
}

export default async function PackagesPage() {
  const { items, categories } = await getPackagesCatalogData()

  return <CatalogPackages paquetes={items} categorias={categories} />
}
