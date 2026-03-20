import Image from "next/image"
import { BedDouble, Car, Utensils, User, Ticket, MapPin } from "lucide-react"
import { ImageGallery } from "@/components/product/image-gallery"
import { SidebarCotizacionCart } from "@/components/product/sidebar-cotizacion-cart"
import { UbicacionMap } from "@/components/product/ubicacion-map"
import type { Moneda } from "@/types/shared/enums"

export interface PaqueteViewData {
  id: string
  nombre: string
  descripcion_corta: string
  duracion_dias: number
  precio_desde: number
  moneda: Moneda
  imagen_url: string
  incluye_alojamiento: boolean
  incluye_traslado: boolean
  incluye_comidas: boolean
  incluye_guia: boolean
  incluye_entradas: boolean
  categoria: string
  fecha_salida?: string
  itinerario: Array<{
    dia: number
    titulo: string
    descripcion: string
  }>
  galeria: string[]
  ubicacion: string
  latitud: number
  longitud: number
  paqueteFechaId: string | null
}

interface PaqueteViewProps {
  paquete: PaqueteViewData
}

const incluyeItems = (paquete: PaqueteViewData) => [
  {
    icon: <BedDouble className="w-5 h-5 text-primary" />,
    label: "Alojamiento",
    incluye: paquete.incluye_alojamiento,
  },
  {
    icon: <Car className="w-5 h-5 text-primary" />,
    label: "Traslados",
    incluye: paquete.incluye_traslado,
  },
  {
    icon: <Utensils className="w-5 h-5 text-primary" />,
    label: "Comidas",
    incluye: paquete.incluye_comidas,
  },
  {
    icon: <User className="w-5 h-5 text-primary" />,
    label: "Guía",
    incluye: paquete.incluye_guia,
  },
  {
    icon: <Ticket className="w-5 h-5 text-primary" />,
    label: "Entradas",
    incluye: paquete.incluye_entradas,
  },
]

export function PaqueteView({ paquete }: PaqueteViewProps) {
  const duracion = `${paquete.duracion_dias} ${paquete.duracion_dias === 1 ? "día" : "días"}`

  return (
    <main className="min-h-screen bg-off-white">
      {/* Hero — full width with gradient overlay */}
      <div className="relative w-full h-[60vh] min-h-[420px] md:h-screen md:min-h-[540px] overflow-hidden bg-dark-brown">
        {paquete.imagen_url && (
          <Image
            src={paquete.imagen_url}
            alt={paquete.nombre}
            fill
            priority
            className="object-cover"
          />
        )}
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />

        {/* Title overlay — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-20 pb-10 md:pb-14">
          <span className="text-xs uppercase tracking-[0.22em] text-off-white/70 font-sans block mb-3">
            {paquete.categoria}
          </span>
          <h1 className="font-serif text-4xl md:text-[64px] font-normal italic text-off-white leading-none mb-4 max-w-3xl">
            {paquete.nombre}
          </h1>
          <p className="text-base md:text-xl text-off-white/80 font-sans max-w-2xl leading-relaxed">
            {paquete.descripcion_corta}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px] py-14 md:py-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Column */}
          <div className="flex-1 min-w-0">
            {/* Itinerario */}
            <section className="mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-8">
                Itinerario
              </h2>

              <div className="relative pl-8 md:pl-10">
                {/* Vertical line */}
                <div className="absolute left-3 top-2 bottom-2 w-px bg-primary/30" />

                {paquete.itinerario.map((dia) => (
                  <div key={dia.dia} className="relative mb-8 last:mb-0">
                    {/* Circle */}
                    <div className="absolute -left-[1.625rem] top-1 w-4 h-4 rounded-full border-2 border-primary bg-off-white" />

                    <div>
                      <h3 className="font-sans text-lg md:text-2xl font-semibold text-primary mb-2">
                        Día {dia.dia}: {dia.titulo}
                      </h3>
                      <p className="text-sm md:text-base text-subtle font-sans leading-relaxed">
                        {dia.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Qué Incluye */}
            <section className="mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-8">
                Qué Incluye
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {incluyeItems(paquete)
                  .filter((item) => item.incluye)
                  .map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 bg-primary/5 border border-primary/15 px-4 py-4"
                    >
                      {item.icon}
                      <span className="font-sans text-sm font-medium text-dark-brown">
                        {item.label}
                      </span>
                    </div>
                  ))}
              </div>
            </section>

            {/* Galería */}
            <section className="mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-8">
                Galería
              </h2>
              <ImageGallery
                images={paquete.galeria}
                alt={paquete.nombre}
              />
            </section>

            {/* Ubicación */}
            <section>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-8">
                Ubicación
              </h2>
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-sans text-sm text-subtle">
                  {paquete.ubicacion}
                </span>
              </div>
              <UbicacionMap
                nombre={paquete.nombre}
                latitud={paquete.latitud}
                longitud={paquete.longitud}
              />
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-28">
              <SidebarCotizacionCart
                precio={paquete.precio_desde}
                moneda={paquete.moneda}
                fecha={paquete.fecha_salida}
                duracion={duracion}
                tipo="paquete"
                cartItem={
                  paquete.paqueteFechaId
                    ? {
                        id: `paquete:${paquete.paqueteFechaId}`,
                        kind: "paquete",
                        category: paquete.categoria,
                        name: paquete.nombre,
                        description: paquete.descripcion_corta,
                        unitPrice: paquete.precio_desde,
                        quantity: 1,
                        image: paquete.imagen_url,
                        moneda: paquete.moneda,
                        paqueteFechaId: paquete.paqueteFechaId,
                        experienciaId: null,
                      }
                    : null
                }
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
