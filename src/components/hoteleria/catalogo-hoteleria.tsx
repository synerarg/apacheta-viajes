"use client"

import { useState } from "react"
import { HotelCard } from "@/components/hoteleria/hotel-card"
import { hotelesMock } from "@/lib/mock-data/hoteles"

const ITEMS_PER_PAGE = 6

export function CatalogoHoteleria() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const visible = hotelesMock.slice(0, visibleCount)
  const hasMore = visibleCount < hotelesMock.length

  return (
    <main className="min-h-screen bg-off-white pt-36 pb-20">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.22em] text-subtle font-sans block mb-4">
            Recomendada por Apacheta
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-normal italic text-dark-brown mb-5 leading-none">
            Hotelería
          </h1>
          <p className="text-base md:text-xl text-subtle font-sans max-w-2xl leading-relaxed">
            Una selección de refugios con identidad y calor local. Lugares donde
            el silencio de la montaña se convierte en el mayor lujo.
          </p>
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 lg:gap-y-12">
            {visible.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-subtle font-sans">
              No hay hoteles en esta categoría.
            </p>
          </div>
        )}

        {/* Cargar más */}
        {hasMore && (
          <div className="flex justify-center mt-14">
            <button
              onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
              className="border border-dark-brown text-dark-brown font-sans text-sm px-10 py-3 hover:bg-dark-brown hover:text-off-white transition-colors"
            >
              Cargar Más
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
