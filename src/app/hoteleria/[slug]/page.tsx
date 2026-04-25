import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Star } from "lucide-react"

import { HotelAvailabilityForm } from "@/components/hoteleria/hotel-availability-form"
import { createServerHotelesController } from "@/controllers/hoteles/hoteles.controller"
import type { HotelesRow } from "@/types/hoteles/hoteles.types"

type HotelPageProps = {
  params: Promise<{
    slug: string
  }>
}

function buildStars(stars: number) {
  return Array.from({ length: 5 }, (_, index) => index < stars)
}

async function getRealHotelBySlug(slug: string) {
  const controller = await createServerHotelesController()

  return controller.get({ slug, activo: true })
}

function getHotelLocation(hotel: HotelesRow) {
  return (
    [hotel.ciudad, hotel.provincia].filter(Boolean).join(", ") ||
    hotel.direccion ||
    "Ubicacion a confirmar"
  )
}

export async function generateMetadata({
  params,
}: HotelPageProps): Promise<Metadata> {
  const { slug } = await params
  const hotel = await getRealHotelBySlug(slug)

  if (!hotel) {
    return {
      title: "Hotel no encontrado | Apacheta Viajes",
    }
  }

  return {
    title: `${hotel.nombre} | Hotelería | Apacheta Viajes`,
    description:
      hotel.descripcion_corta ??
      "Hotel disponible para reservar con Apacheta Viajes.",
  }
}

export default async function HotelDetailPage({ params }: HotelPageProps) {
  const { slug } = await params
  const hotel = await getRealHotelBySlug(slug)

  if (!hotel) {
    notFound()
  }

  const hotelLocation = getHotelLocation(hotel)
  const hotelCategory = "Hotel"
  const hotelStars = hotel.estrellas ?? 0
  const hotelDescription =
    hotel.descripcion ?? "Hotel disponible para reservar con Apacheta Viajes."

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
              {hotelCategory}
            </span>
            <h1 className="mb-4 font-serif text-4xl italic text-dark-brown md:text-5xl lg:text-[64px]">
              {hotel.nombre}
            </h1>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex gap-1">
                {buildStars(hotelStars).map((filled, index) => (
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
                {hotelStars} estrellas
              </span>
            </div>
            <div className="mb-8 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-sans text-base text-dark-brown">
                {hotelLocation}
              </span>
            </div>
            <p className="max-w-3xl whitespace-pre-line font-sans text-base leading-relaxed text-dark-brown">
              {hotelDescription}
            </p>
          </div>

          <div className="border border-dark-brown/15 bg-white p-5 sm:p-6 md:p-8">
            <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-muted">
              {hotel.imagen_url ? (
                <Image
                  src={hotel.imagen_url}
                  alt={hotel.nombre}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center font-sans text-sm text-subtle">
                  Imagen en actualización
                </div>
              )}
            </div>

            <p className="mb-2 font-sans text-xs uppercase tracking-[0.18em] text-subtle">
              Tarifa de referencia
            </p>
            <p className="mb-6 font-sans text-3xl font-bold text-primary">
              Consultar disponibilidad
            </p>

            <div className="mb-8 space-y-3 border-y border-dark-brown/10 py-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-sans text-sm text-subtle">Categoría</span>
                <span className="font-sans text-sm font-medium text-dark-brown">
                  {hotelCategory}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-sans text-sm text-subtle">Ubicación</span>
                <span className="text-right font-sans text-sm font-medium text-dark-brown">
                  {hotelLocation}
                </span>
              </div>
            </div>

            <HotelAvailabilityForm hotelId={hotel.id} />
          </div>
        </div>
      </div>
    </main>
  )
}
