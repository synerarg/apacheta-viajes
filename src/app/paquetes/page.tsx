import type { Metadata } from "next"
import { CatalogoPaquetes } from "@/components/paquetes/catalogo-paquetes"

export const metadata: Metadata = {
  title: "Paquetes | Apacheta Viajes",
  description:
    "Circuitos y paquetes turísticos por el Norte Argentino. Valles Calchaquíes, Puna, Quebrada de Humahuaca y más.",
}

export default function PaquetesPage() {
  return <CatalogoPaquetes />
}
