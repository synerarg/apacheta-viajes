import type { Metadata } from "next"
import { CatalogoHoteleria } from "@/components/hoteleria/catalogo-hoteleria"
import type { HotelCardItem } from "@/components/hoteleria/hotel-card"
import { createServerHotelesController } from "@/controllers/hoteles/hoteles.controller"
import type { HotelesRow } from "@/types/hoteles/hoteles.types"

export const metadata: Metadata = {
  title: "Hotelería | Apacheta Viajes",
  description:
    "Selección de hoteles boutique, lodges y fincas en el Norte Argentino. Salta, Jujuy, Cafayate, Tilcara y más.",
}

function toHotelCardItem(hotel: HotelesRow): HotelCardItem {
  const ubicacion = [hotel.ciudad, hotel.provincia].filter(Boolean).join(", ")

  return {
    id: hotel.id,
    nombre: hotel.nombre,
    slug: hotel.slug,
    ubicacion: ubicacion || hotel.direccion || "Ubicacion a confirmar",
    descripcion_corta: hotel.descripcion_corta,
    estrellas: hotel.estrellas ?? 0,
    precio_desde: null,
    moneda: "ARS",
    imagen_url: hotel.imagen_url,
    categoria: "Hotel",
    activo: hotel.activo,
    orden: hotel.orden,
  }
}

export default async function HoteleriaPage() {
  const controller = await createServerHotelesController()
  const hoteles = await controller.list({ activo: true })
  const mappedHotels =
    hoteles.length > 0
      ? hoteles
          .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999))
          .map(toHotelCardItem)
      : []

  return <CatalogoHoteleria hoteles={mappedHotels} />
}
