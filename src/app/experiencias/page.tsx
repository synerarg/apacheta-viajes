import type { Metadata } from "next"
import { CatalogoExperiencias } from "@/components/experiencias/catalogo-experiencias"

export const metadata: Metadata = {
  title: "Experiencias | Apacheta Viajes",
  description:
    "Experiencias únicas en el Norte Argentino: cultura andina, trekking, vinos de altura, safaris fotográficos y más.",
}

export default function ExperienciasPage() {
  return <CatalogoExperiencias />
}
