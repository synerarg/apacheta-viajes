import type { Metadata } from "next"

import { CatalogoTraslados } from "@/components/traslados/catalogo-traslados"
import { getTrasladosCatalogData } from "@/lib/storefront/traslados.server"

export const metadata: Metadata = {
  title: "Traslados | Apacheta Viajes",
  description:
    "Servicios de transfer en el Norte Argentino: traslados regulares y privados entre aeropuertos, hoteles y destinos turísticos en Salta, Jujuy, Tucumán y más.",
}

export default async function TrasladosPage() {
  const { items, origenes, tipos } = await getTrasladosCatalogData()

  return <CatalogoTraslados traslados={items} origenes={origenes} tipos={tipos} />
}
