import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

const hotels = [
  {
    id: 1,
    name: "Nombre Hotel 1",
    location: "Ubicación del Hotel",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HPq8iEowKwgV3oFMlY4me9iBOJey2B.png",
    stars: 4,
  },
  {
    id: 2,
    name: "Nombre Hotel 2",
    location: "Ubicación del Hotel",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HPq8iEowKwgV3oFMlY4me9iBOJey2B.png",
    stars: 5,
  },
  {
    id: 3,
    name: "Nombre Hotel 3",
    location: "Ubicación del Hotel",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HPq8iEowKwgV3oFMlY4me9iBOJey2B.png",
    stars: 3,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count 
              ? "fill-primary text-primary" 
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )
}

export function HotelsSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Recomendada por Apacheta
          </p>
          <h2 className="font-serif text-4xl italic text-foreground md:text-5xl">
            Hotelería
          </h2>
        </div>

        {/* Hotels Grid */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {hotels.map((hotel) => (
            <Link 
              key={hotel.id} 
              href="#"
              className="group block"
            >
              <div className="mb-4 aspect-[4/5] overflow-hidden rounded-lg">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  width={400}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                {hotel.name}
              </h3>
              <p className="mb-2 text-sm text-muted-foreground">
                {hotel.location}
              </p>
              <StarRating count={hotel.stars} />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button 
            asChild
            className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            <Link href="#">Ver Hotelería Completa</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
