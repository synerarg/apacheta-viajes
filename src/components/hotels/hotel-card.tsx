import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"

export interface HotelCardItem {
  id: string | number
  nombre: string
  slug: string
  ubicacion: string
  descripcion_corta: string | null
  estrellas: number
  precio_desde: number | null
  moneda: string
  imagen_url: string | null
  categoria: string
  activo: boolean | null
  orden: number | null
}

interface HotelCardProps {
  hotel: HotelCardItem
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-primary text-primary" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Link href={`/hoteleria/${hotel.slug}`} className="group block">
      <article>
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted mb-4">
          {hotel.imagen_url ? (
            <Image
              src={hotel.imagen_url}
              alt={hotel.nombre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center font-sans text-sm text-subtle">
              Imagen en actualización
            </div>
          )}
          {/* Category tag */}
          <div className="absolute top-4 left-4">
            <span className="text-[10px] uppercase tracking-[0.18em] bg-off-white text-dark-brown font-sans px-2.5 py-1">
              {hotel.categoria}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <StarRating rating={hotel.estrellas} />
          <h2 className="font-serif text-xl lg:text-2xl font-normal text-dark-brown group-hover:text-primary transition-colors leading-snug">
            {hotel.nombre}
          </h2>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <p className="text-sm text-subtle font-sans">{hotel.ubicacion}</p>
          </div>
          {hotel.precio_desde ? (
            <p className="text-xs text-subtle font-sans pt-0.5">
              Desde{" "}
              <span className="font-bold text-primary">
                {hotel.moneda} ${hotel.precio_desde.toLocaleString("es-AR")}
              </span>
            </p>
          ) : (
            <p className="text-xs text-subtle font-sans pt-0.5">
              <span className="font-bold text-primary">
                Consultar disponibilidad
              </span>
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
