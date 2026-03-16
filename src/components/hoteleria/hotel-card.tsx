import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import type { HotelMock } from "@/lib/mock-data/hoteles"

interface HotelCardProps {
  hotel: HotelMock
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
          {hotel.imagen_url && (
            <Image
              src={hotel.imagen_url}
              alt={hotel.nombre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
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
          <p className="text-xs text-subtle font-sans pt-0.5">
            Desde{" "}
            <span className="font-bold text-primary">
              ARS ${hotel.precio_desde.toLocaleString("es-AR")}
            </span>
          </p>
        </div>
      </article>
    </Link>
  )
}
