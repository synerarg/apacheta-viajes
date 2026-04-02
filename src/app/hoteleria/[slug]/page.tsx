import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Star } from "lucide-react"

import { hotelesMock } from "@/lib/mock-data/hoteles"

const HOTEL_FALLBACK_IMAGE = "/landing/placeholder-2.png"

type HotelPageProps = {
  params: Promise<{
    slug: string
  }>
}

function buildStars(stars: number) {
  return Array.from({ length: 5 }, (_, index) => index < stars)
}

function getHotelBySlug(slug: string) {
  return hotelesMock.find((hotel) => hotel.slug === slug && hotel.activo)
}

export async function generateMetadata({
  params,
}: HotelPageProps): Promise<Metadata> {
  const { slug } = await params
  const hotel = getHotelBySlug(slug)

  if (!hotel) {
    return {
      title: "Hotel no encontrado | Apacheta Viajes",
    }
  }

  return {
    title: `${hotel.nombre} | Hotelería | Apacheta Viajes`,
    description: hotel.descripcion_corta,
  }
}

export default async function HotelDetailPage({ params }: HotelPageProps) {
  const { slug } = await params
  const hotel = getHotelBySlug(slug)

  if (!hotel) {
    notFound()
  }

  const imageSrc = hotel.imagen_url || HOTEL_FALLBACK_IMAGE

  return (
    <main className="min-h-screen bg-off-white pb-20 pt-28">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        <Link
          href="/hoteleria"
          className="mb-6 inline-flex items-center gap-2 font-sans text-sm text-subtle transition-colors hover:text-dark-brown"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a hotelería
        </Link>

        <div className="mb-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
          <div>
            <span className="mb-4 block font-sans text-xs uppercase tracking-[0.2em] text-subtle">
              {hotel.categoria}
            </span>
            <h1 className="mb-4 font-serif text-4xl italic text-dark-brown md:text-5xl lg:text-[64px]">
              {hotel.nombre}
            </h1>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex gap-1">
                {buildStars(hotel.estrellas).map((filled, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      filled
                        ? "fill-primary text-primary"
                        : "fill-dark-brown/10 text-dark-brown/20"
                    }`}
                  />
                ))}
              </div>
              <span className="font-sans text-sm text-subtle">
                {hotel.estrellas} estrellas
              </span>
            </div>
            <div className="mb-8 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-sans text-base text-dark-brown">
                {hotel.ubicacion}
              </span>
            </div>
            <p className="max-w-3xl whitespace-pre-line font-sans text-base leading-relaxed text-dark-brown">
              {hotel.descripcion}
            </p>
          </div>

          <div className="border border-dark-brown/15 bg-white p-5 sm:p-6 md:p-8">
            <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={imageSrc}
                alt={hotel.nombre}
                fill
                className="object-cover"
                priority
              />
            </div>

            <p className="mb-2 font-sans text-xs uppercase tracking-[0.18em] text-subtle">
              Tarifa de referencia
            </p>
            <p className="mb-6 font-sans text-3xl font-bold text-primary">
              {hotel.moneda} ${hotel.precio_desde.toLocaleString("es-AR")}
            </p>

            <div className="mb-8 space-y-3 border-y border-dark-brown/10 py-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-sans text-sm text-subtle">Categoría</span>
                <span className="font-sans text-sm font-medium text-dark-brown">
                  {hotel.categoria}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-sans text-sm text-subtle">Ubicación</span>
                <span className="text-right font-sans text-sm font-medium text-dark-brown">
                  {hotel.ubicacion}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/contacto"
                className="inline-flex justify-center bg-primary px-6 py-4 text-center font-sans text-sm font-bold text-off-white transition-colors hover:bg-primary/85"
              >
                Consultar disponibilidad
              </Link>
              <Link
                href="/hoteleria"
                className="inline-flex justify-center border border-dark-brown/20 px-6 py-4 text-center font-sans text-sm font-bold text-dark-brown transition-colors hover:bg-dark-brown/5"
              >
                Ver más hoteles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
