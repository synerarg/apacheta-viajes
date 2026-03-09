import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const destinations = [
  {
    name: "Nombre Destino",
    description: "Breve descripción del viaje",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
  },
  {
    name: "Nombre Destino",
    description: "Breve descripción del viaje",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop",
  },
  {
    name: "Nombre Destino",
    description: "Breve descripción del viaje",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
  },
]

export function PartnersSection() {
  return (
    <section className="bg-[#2d2a26] py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Para Agencias y Operadores */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center mb-20">
          <div>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4 block">
              Para Agencias y Operadores
            </span>
            <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-white mb-6 text-balance">
              Tu partner operativo en el Norte Argentino
            </h2>
            <p className="text-neutral-300 leading-relaxed mb-8 max-w-lg">
              Somos el DMC que necesitas en destino. Operación integral, logística propia y 
              un equipo que se hace cargo. Trabajamos con agencias de Argentina, USA, 
              Europa y Brasil.
            </p>
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
            >
              <Link href="#contacto">Contactate</Link>
            </Button>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop"
              alt="Guía de Apacheta Viajes con vehículo 4x4 en las montañas del Norte Argentino"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Emisivo - Viajes al Exterior */}
        <div className="text-center mb-12">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4 block">
            Emisivo - Viajes al Exterior
          </span>
          <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-white mb-6 text-balance">
            Descubrí el mundo con Apacheta
          </h2>
          <p className="text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            Además de ser especialistas en el Norte Argentino, te llevamos a los mejores destinos 
            internacionales. Aéreos, hoteles, paquetes y asistencia al viajero, todo desde Salta.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {destinations.map((destination, index) => (
            <Link 
              key={index} 
              href="#"
              className="group block"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-1 group-hover:text-primary transition-colors">
                {destination.name}
              </h3>
              <p className="text-sm text-neutral-400">
                {destination.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button 
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
          >
            <Link href="#emisivo">Consultar Viajes al Exterior</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
