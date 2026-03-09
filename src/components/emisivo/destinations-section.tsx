"use client"

import { useState } from "react"
import Image from "next/image"

const destinations = [
  {
    id: "peru",
    name: "Perú & Camino Inca",
    image: "",
  },
  {
    id: "caribe",
    name: "Caribe & Centroamérica",
    image: "",
  },
  {
    id: "europa",
    name: "Europa Clásica",
    image: "",
  },
  {
    id: "usa",
    name: "Estados Unidos",
    image: "",
  },
]

export function DestinationsSection() {
  const [activeDestination, setActiveDestination] = useState(destinations[0])

  return (
    <section className="py-20 lg:py-28 bg-[#f2f2f2]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-8 lg:gap-12">
          {/* Left Column - Destination List */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8 block">
              Nuestros Destinos
            </span>

            {/* Mobile: Horizontal scrollable tabs */}
            <div className="flex lg:hidden gap-3 overflow-x-auto pb-4 -mx-4 px-4">
              {destinations.map((destination) => (
                <button
                  key={destination.id}
                  onClick={() => setActiveDestination(destination)}
                  className={`whitespace-nowrap px-4 py-2 border transition-all text-sm ${
                    activeDestination.id === destination.id
                      ? "bg-[#8b1a1a] text-white border-[#8b1a1a]"
                      : "bg-transparent text-muted-foreground border-border hover:border-[#8b1a1a] hover:text-foreground"
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
                  className={`text-left py-5 border-b border-[#2c2621]/20 transition-all duration-300 ${
                    activeDestination.id === destination.id
                      ? "opacity-100"
                      : "opacity-30 hover:opacity-60"
                  }`}
                >
                  <span className="font-serif italic text-2xl xl:text-3xl text-[#2e2726]">
                    {destination.name}
                  </span>
                </button>
              ))}
              <div className="border-b border-[#2c2621]/20" />
            </div>
          </div>

          {/* Right Column - Destination Image with terracotta shadow */}
          <div className="relative h-[350px] md:h-[500px] lg:h-[620px] rounded-[2px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(180,83,56,0.15)]">
            {destinations.map((destination) => (
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
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
