"use client"

import { useState } from "react"
import { FilterBar } from "@/components/catalog/filter-bar"
import { PackageCard } from "@/components/catalog/package-card"
import type { StorefrontPackageItem } from "@/types/storefront/storefront.types"

const ITEMS_PER_PAGE = 3

interface CatalogoPaquetesProps {
  paquetes: StorefrontPackageItem[]
  categorias: string[]
}

export function CatalogoPaquetes({
  paquetes,
  categorias,
}: CatalogoPaquetesProps) {
  const [activeCategoria, setActiveCategoria] = useState("Todos")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const filtered =
    activeCategoria === "Todos"
      ? paquetes
      : paquetes.filter((paquete) => paquete.category === activeCategoria)

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleCategoriaChange = (cat: string) => {
    setActiveCategoria(cat)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  return (
    <main className="min-h-screen bg-off-white pt-28 pb-20">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.22em] text-subtle font-sans block mb-4">
            Paquetes NOA
          </span>
          <h1 className="font-serif text-5xl md:text-[64px] font-normal italic text-dark-brown mb-5 leading-none">
            Paquetes Destacados
          </h1>
          <p className="text-base md:text-xl text-subtle font-sans max-w-2xl leading-relaxed">
            Circuitos cuidadosamente diseñados para mostrar lo mejor del Norte
            Argentino. Cada paquete incluye guía especializado y logística
            completa.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <FilterBar
            categorias={categorias}
            activeCategoria={activeCategoria}
            onCategoriaChange={handleCategoriaChange}
          />
        </div>

        {/* Cards list */}
        <div>
          {visible.length > 0 ? (
            visible.map((paquete) => (
              <PackageCard key={paquete.id} paquete={paquete} />
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-subtle font-sans">
                No hay paquetes en esta categoría.
              </p>
            </div>
          )}
        </div>

        {/* Cargar más */}
        {hasMore && (
          <div className="flex justify-center mt-4">
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
