"use client"

import { useState } from "react"
import { FilterBar } from "@/components/catalog/filter-bar"
import { ExperienciaCard } from "@/components/catalog/experiencia-card"
import type { StorefrontExperienceItem } from "@/types/storefront/storefront.types"

interface CatalogoExperienciasProps {
  experiencias: StorefrontExperienceItem[]
  categorias: string[]
  initialCategoria?: string
}

export function CatalogoExperiencias({
  experiencias,
  categorias,
  initialCategoria = "Todos",
}: CatalogoExperienciasProps) {
  const [activeCategoria, setActiveCategoria] = useState(initialCategoria)

  const filtered =
    activeCategoria === "Todos"
      ? experiencias
      : experiencias.filter((experience) => experience.category === activeCategoria)

  // Build asymmetric masonry layout
  // Left col: tall + 2 shorter | Center col: 2 medium | Right col: tall + medium + shorter
  const col1 = filtered.filter((_, i) => i % 3 === 0)
  const col2 = filtered.filter((_, i) => i % 3 === 1)
  const col3 = filtered.filter((_, i) => i % 3 === 2)

  const handleCategoriaChange = (cat: string) => {
    setActiveCategoria(cat)
  }

  return (
    <main className="min-h-screen bg-off-white pt-36 pb-20">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.22em] text-subtle font-sans block mb-4">
            Elegí tu Experiencia
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-normal italic text-dark-brown mb-5 leading-tight">
            El Norte Argentino tiene algo
            <br className="hidden md:block" /> para cada viajero
          </h1>
          <p className="text-base md:text-xl text-subtle font-sans max-w-2xl leading-relaxed">
            Experiencias únicas diseñadas para conectarte con la cultura, el
            paisaje y la gente del NOA.
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

        {/* Masonry Grid — desktop 3 cols, mobile single col */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-subtle font-sans">
              No hay experiencias en esta categoría.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: single column */}
            <div className="flex flex-col gap-4 md:hidden">
              {filtered.map((exp) => (
                <ExperienciaCard
                  key={exp.id}
                  experiencia={exp}
                  className="h-[260px]"
                />
              ))}
            </div>

            {/* Desktop: asymmetric 3-column masonry */}
            <div className="hidden md:grid md:grid-cols-3 gap-4">
              {/* Column 1 */}
              <div className="flex flex-col gap-4">
                {col1.map((exp, i) => (
                  <ExperienciaCard
                    key={exp.id}
                    experiencia={exp}
                    className={i === 0 ? "h-[480px]" : "h-[240px]"}
                  />
                ))}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-4">
                {col2.map((exp) => (
                  <ExperienciaCard
                    key={exp.id}
                    experiencia={exp}
                    className="h-[360px]"
                  />
                ))}
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-4">
                {col3.map((exp, i) => (
                  <ExperienciaCard
                    key={exp.id}
                    experiencia={exp}
                    className={
                      i === 0 ? "h-[420px]" : i === 1 ? "h-[300px]" : "h-[240px]"
                    }
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
