import type { Metadata } from "next"

import { CatalogTransfers } from "@/components/transfers/catalog-transfers"
import { getTransfersCatalogData } from "@/lib/storefront/traslados.server"

export const metadata: Metadata = {
  title: "Traslados | Apacheta Viajes",
  description:
    "Servicios de transfer en el Norte Argentino: traslados regulares y privados entre aeropuertos, hoteles y destinos turísticos en Salta, Jujuy, Tucumán y más.",
}

export default async function TransfersPage() {
  const { items, origenes, tipos } = await getTransfersCatalogData()

  return <CatalogTransfers traslados={items} origenes={origenes} tipos={tipos} />
}
