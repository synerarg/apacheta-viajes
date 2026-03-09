import Image from "next/image"
import { Button } from "@/components/ui/button"

const packages = [
  {
    id: 1,
    name: "Nombre Paquete 1",
    description: "Breve descripción del paquete",
    price: "XXX.XXX",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gQ7bwkD6cnSeat5oL1oUrZg2Y0dKq6.png",
  },
  {
    id: 2,
    name: "Nombre Paquete 2",
    description: "Breve descripción del paquete",
    price: "XXX.XXX",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gQ7bwkD6cnSeat5oL1oUrZg2Y0dKq6.png",
  },
  {
    id: 3,
    name: "Nombre Paquete 3",
    description: "Breve descripción del paquete",
    price: "XXX.XXX",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gQ7bwkD6cnSeat5oL1oUrZg2Y0dKq6.png",
  },
]

export function PackagesSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Paquetes NOA
          </p>
          <h2 className="font-serif text-3xl italic text-foreground md:text-4xl lg:text-5xl">
            Paquetes Destacados
          </h2>
        </div>

        {/* Package Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="group">
              {/* Image */}
              <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-lg">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              {/* Content */}
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium text-foreground">
                  {pkg.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pkg.description}
                </p>
                <p className="mt-1 text-sm font-medium text-primary">
                  Desde ARS ${pkg.price}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-fit border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Ver Detalle
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 flex justify-center">
          <Button className="bg-primary px-8 text-primary-foreground hover:bg-primary/90">
            Ver Todos Los Paquetes
          </Button>
        </div>
      </div>
    </section>
  )
}
