import type { Metadata } from "next"
import { CatalogoPaquetes } from "@/components/paquetes/catalogo-paquetes"
import { getPackagesCatalogData } from "@/lib/storefront/storefront.server"

export const metadata: Metadata = {
  title: "Paquetes | Apacheta Viajes",
  description:
    "Circuitos y paquetes turísticos por el Norte Argentino. Valles Calchaquíes, Puna, Quebrada de Humahuaca y más.",
}

export default async function PaquetesPage() {
  const { items, categories } = await getPackagesCatalogData()

  return <CatalogoPaquetes paquetes={items} categorias={categories} />
}
