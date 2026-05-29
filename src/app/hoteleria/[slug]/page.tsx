import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, MapPin, Star } from "lucide-react"

import { HotelAvailabilityForm } from "@/components/hotels/hotel-availability-form"
import { createServerHotelsController } from "@/controllers/hotels/hotels.controller"
import { createServerHyperGuestController } from "@/controllers/hyperguest/hyperguest.controller"
import {
  extractPropertyDisplay,
  type PropertyDisplay,
} from "@/lib/hyperguest/offer-display"
import type { HotelsRow } from "@/types/hotels/hotels.types"

type HotelPageProps = {
  params: Promise<{ slug: string }>
}

function buildStars(stars: number) {
  return Array.from({ length: 5 }, (_, i) => i < stars)
}

async function getRealHotelBySlug(slug: string) {
  const controller = await createServerHotelsController()
  return controller.get({ slug, activo: true })
}

async function getPropertyDisplay(hotelId: string): Promise<PropertyDisplay | null> {
  try {
    const controller = await createServerHyperGuestController()
    const mapping = await controller.getMappingByHotelId(hotelId)
    if (!mapping?.hyperguest_payload) return null
    const display = extractPropertyDisplay(mapping.hyperguest_payload)
    if (!display.photos.length && !display.facilities.length && !display.remarks.length && !display.longDescription) return null
    return display
  } catch {
    return null
  }
}

function getHotelLocation(hotel: HotelsRow) {
  return [hotel.ciudad, hotel.provincia].filter(Boolean).join(", ") || hotel.direccion || null
}

export async function generateMetadata({ params }: HotelPageProps): Promise<Metadata> {
  const { slug } = await params
  const hotel = await getRealHotelBySlug(slug)
  if (!hotel) return { title: "Hotel no encontrado | Apacheta Viajes" }
  return {
    title: `${hotel.nombre} | Hotelería | Apacheta Viajes`,
    description: hotel.descripcion_corta ?? "Hotel disponible para reservar con Apacheta Viajes.",
  }
}

export default async function HotelDetailPage({ params }: HotelPageProps) {
  const { slug } = await params
  const hotel = await getRealHotelBySlug(slug)
  if (!hotel) notFound()

  const hotelLocation = getHotelLocation(hotel)
  const hotelStars = hotel.estrellas ?? 0
  const providerDisplay = await getPropertyDisplay(hotel.id)

  const description = providerDisplay?.longDescription ?? hotel.descripcion ?? null
  const allPhotos = providerDisplay?.photos ?? []
  const heroImage = hotel.imagen_url ?? allPhotos[0] ?? null
  const galleryPhotos = allPhotos.filter(url => url !== heroImage).slice(0, 8)
  const facilities = providerDisplay?.facilities ?? []
  const remarks = providerDisplay?.remarks ?? []

  return (
    <main className="min-h-screen bg-off-white">

      {/* Hero */}
      <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden bg-muted sm:h-[60vh]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={hotel.nombre}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-dark-brown/5">
            <span className="font-sans text-sm text-subtle">Imagen en actualización</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/40 via-transparent to-transparent" />

        <Link
          href="/hoteleria"
          className="absolute left-4 top-6 inline-flex items-center gap-2 font-sans text-sm text-white/90 transition-colors hover:text-white sm:left-8 sm:top-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a hotelería
        </Link>
      </div>

      {/* Content */}
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-[1280px] pb-24">

        {/* Main grid: info + booking widget */}
        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_400px]">

          {/* Left: hotel info */}
          <div>
            <span className="mb-3 block font-sans text-xs uppercase tracking-[0.22em] text-subtle">
              Hotel
            </span>
            <h1 className="mb-4 font-serif text-4xl font-normal italic text-dark-brown md:text-5xl lg:text-[56px] lg:leading-none">
              {hotel.nombre}
            </h1>

            <div className="mb-2 flex flex-wrap items-center gap-4">
              {hotelStars > 0 ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {buildStars(hotelStars).map((filled, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${filled ? "fill-primary text-primary" : "fill-dark-brown/10 text-dark-brown/15"}`}
                      />
                    ))}
                  </div>
                  <span className="font-sans text-xs text-subtle">{hotelStars} estrellas</span>
                </div>
              ) : null}
              {hotelLocation ? (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="font-sans text-sm text-dark-brown">{hotelLocation}</span>
                </div>
              ) : null}
            </div>

            {description ? (
              <p className="mt-6 max-w-2xl whitespace-pre-line font-sans text-base leading-relaxed text-dark-brown/80">
                {description}
              </p>
            ) : null}

            {/* Facilities */}
            {facilities.length > 0 ? (
              <div className="mt-10">
                <h2 className="mb-5 font-serif text-2xl italic text-dark-brown">
                  Servicios e instalaciones
                </h2>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
                  {facilities.map(facility => (
                    <li key={facility} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="font-sans text-sm text-dark-brown">{facility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Gallery */}
            {galleryPhotos.length > 0 ? (
              <div className="mt-10">
                <h2 className="mb-5 font-serif text-2xl italic text-dark-brown">Galería</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {galleryPhotos.map((url, i) => (
                    <div key={url} className={`relative overflow-hidden bg-muted ${i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square"}`}>
                      <Image
                        src={url}
                        alt={`${hotel.nombre} — foto ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Remarks */}
            {remarks.length > 0 ? (
              <div className="mt-10 border border-dark-brown/10 bg-dark-brown/[0.02] p-6">
                <h2 className="mb-4 font-serif text-xl italic text-dark-brown">
                  Información importante
                </h2>
                <ul className="space-y-2">
                  {remarks.map((remark, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-sm leading-relaxed text-dark-brown/80">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      <span className="whitespace-pre-line">{remark}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Right: booking widget (sticky) */}
          <div className="lg:sticky lg:top-8">
            <div className="border border-dark-brown/15 bg-white p-6 shadow-sm">
              <p className="mb-1 font-sans text-xs uppercase tracking-[0.18em] text-subtle">
                Reservar
              </p>
              <p className="mb-6 font-serif text-xl italic text-dark-brown">
                Consultá disponibilidad
              </p>
              <HotelAvailabilityForm hotelId={hotel.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
