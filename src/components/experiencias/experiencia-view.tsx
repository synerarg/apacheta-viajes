import Image from "next/image"
import { MapPin } from "lucide-react"
import { ImageGallery } from "@/components/product/image-gallery"
import { SidebarCotizacionCart } from "@/components/product/sidebar-cotizacion-cart"
import { UbicacionMap } from "@/components/product/ubicacion-map"

export interface ExperienciaViewData {
  id: string
  nombre: string
  descripcion: string
  descripcion_corta: string
  duracion_horas: number
  precio: number
  moneda: string
  imagen_url: string
  ubicacion: string
  latitud: number
  longitud: number
  categoria: string
  fecha_salida?: string
  longitud_km?: number
  galeria?: string[]
}

interface ExperienciaViewProps {
  experiencia: ExperienciaViewData
}

export function ExperienciaView({ experiencia }: ExperienciaViewProps) {
  const duracion =
    experiencia.duracion_horas >= 24
      ? `${Math.floor(experiencia.duracion_horas / 24)} días`
      : `${experiencia.duracion_horas} horas`

  const longitud = experiencia.longitud_km
    ? `${experiencia.longitud_km} km`
    : undefined

  return (
    <main className="min-h-screen bg-off-white pt-28 pb-20">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Page header — no full-width hero */}
        <div className="mb-8 md:mb-10">
          <span className="text-xs uppercase tracking-[0.22em] text-subtle font-sans block mb-4">
            {experiencia.categoria}
          </span>
          <h1 className="font-serif text-4xl md:text-[64px] font-normal italic text-dark-brown leading-none mb-4">
            {experiencia.nombre}
          </h1>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-sans text-base md:text-xl text-subtle">
              {experiencia.ubicacion}
            </span>
          </div>
        </div>

        {/* Hero image — contained, not full-width */}
        <div className="relative w-full h-[220px] md:h-[370px] bg-muted mb-12 md:mb-16 overflow-hidden">
          {experiencia.imagen_url && (
            <Image
              src={experiencia.imagen_url}
              alt={experiencia.nombre}
              fill
              priority
              className="object-cover"
            />
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Column */}
          <div className="flex-1 min-w-0">
            {/* Sobre la Experiencia */}
            <section className="mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-6">
                Sobre la Experiencia
              </h2>
              <p className="font-sans text-sm md:text-base text-subtle leading-relaxed whitespace-pre-line">
                {experiencia.descripcion}
              </p>
            </section>

            {/* Galería */}
            <section className="mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-8">
                Galería de Imágenes
              </h2>
              <ImageGallery
                images={(experiencia.galeria ?? []).filter(Boolean)}
                alt={experiencia.nombre}
              />
            </section>

            {/* Ubicación */}
            <section>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-5">
                Ubicación
              </h2>
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-sans text-sm text-subtle">
                  {experiencia.ubicacion}
                </span>
              </div>
              <UbicacionMap
                nombre={experiencia.nombre}
                latitud={experiencia.latitud}
                longitud={experiencia.longitud}
              />
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-28">
              <SidebarCotizacionCart
                precio={experiencia.precio}
                moneda={experiencia.moneda}
                fecha={experiencia.fecha_salida}
                duracion={duracion}
                longitud={longitud}
                tipo="experiencia"
                cartItem={{
                  id: `experiencia:${experiencia.id}`,
                  kind: "experiencia",
                  category: experiencia.categoria,
                  name: experiencia.nombre,
                  description: experiencia.descripcion_corta,
                  unitPrice: experiencia.precio,
                  quantity: 1,
                  image: experiencia.imagen_url,
                  moneda: experiencia.moneda,
                  paqueteFechaId: null,
                  experienciaId: experiencia.id,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
