import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { StorefrontHotelItem } from "@/types/storefront/storefront.types"
import { Star } from "lucide-react"

interface HotelsSectionProps {
  hotels: StorefrontHotelItem[]
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count ? "fill-primary text-primary" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )
}

export function HotelsSection({ hotels }: HotelsSectionProps) {
  return (
    <section id="hoteleria" className="py-16 md:py-24">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
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
        <div className="mx-auto grid gap-8 md:grid-cols-3">
          {hotels.map((hotel) => (
            <Link key={hotel.id} href={hotel.href} className="group block">
              <div className="mb-4 aspect-4/5 overflow-hidden rounded-lg">
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
          <Link href="/hoteleria">
            <Button
              variant="default"
              size="lg"
              className="text-base h-12 px-4 hover:bg-primary/90 cursor-pointer"
            >
              Ver Hotelería Completa
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
