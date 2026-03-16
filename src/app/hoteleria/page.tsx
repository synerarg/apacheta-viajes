import type { Metadata } from "next"
import { CatalogoHoteleria } from "@/components/hoteleria/catalogo-hoteleria"

export const metadata: Metadata = {
  title: "Hotelería | Apacheta Viajes",
  description:
    "Selección de hoteles boutique, lodges y fincas en el Norte Argentino. Salta, Jujuy, Cafayate, Tilcara y más.",
}

export default function HoteleriaPage() {
  return <CatalogoHoteleria />
}
