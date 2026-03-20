"use client"

import { useState } from "react"
import Image from "next/image"

import type { StorefrontEmisivoDestinationItem } from "@/types/storefront/storefront.types"

interface DestinationsSectionProps {
  destinations: StorefrontEmisivoDestinationItem[]
}

export function DestinationsSection({ destinations }: DestinationsSectionProps) {
  const [activeDestination, setActiveDestination] = useState(
    destinations[0] ?? null,
  )

  if (!activeDestination) {
    return null
  }

  return (
    <section className="py-20 lg:py-28 bg-off-white">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-8 lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8 block">
              Nuestros Destinos
            </span>

            <div className="flex lg:hidden gap-3 overflow-x-auto pb-4 -mx-4 px-4">
              {destinations.map((destination) => (
                <button
                  key={destination.id}
                  onClick={() => setActiveDestination(destination)}
                  className={`whitespace-nowrap px-4 py-2 border transition-all text-sm ${
                    activeDestination.id === destination.id
                      ? "bg-primary text-white border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground"
                  }`}
                >
                  {destination.name}
                </button>
              ))}
            </div>

            {/* Desktop: Vertical list with dividers */}
            <div className="hidden lg:flex flex-col">
              {destinations.map((destination) => (
                <button
                  key={destination.id}
                  onClick={() => setActiveDestination(destination)}
                  className={`text-left py-5 border-b border-dark-brown/20 transition-all duration-300 cursor-pointer ${
                    activeDestination.id === destination.id
                      ? "opacity-100"
                      : "opacity-30 hover:opacity-60"
                  }`}
                >
                  <span className="font-serif italic text-2xl xl:text-3xl text-dark-brown">
                    {destination.name}
                  </span>
                </button>
              ))}
              <div className="border-b border-dark-brown/20" />
            </div>
          </div>

          {/* Right Column - Destination Image with terracotta shadow */}
          <div className="relative h-[280px] sm:h-[350px] md:h-[500px] lg:h-[620px] rounded-[2px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(180,83,56,0.15)] md:shadow-[8px_8px_0px_0px_rgba(180,83,56,0.15)]">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeDestination.id === destination.id
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  quality={100}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
