import Image from "next/image"
import Link from "next/link"

import type { StorefrontExperienceCategoryItem } from "@/types/storefront/storefront.types"

interface ExperiencesSectionProps {
  experiences: StorefrontExperienceCategoryItem[]
}

export function ExperiencesSection({ experiences }: ExperiencesSectionProps) {
  return (
    <section id="experiencias" className="py-16 md:py-24 bg-background">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Elegi Tu Experiencia
          </p>
          <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-foreground">
            El Norte Argentino tiene algo para cada viajero
          </h2>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
          {experiences.map((experience) => (
            <Link
              key={experience.id}
              href={experience.href}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={experience.image}
                alt={experience.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

              {/* Label */}
              <div className="absolute bottom-4 left-4">
                <span className="inline-block bg-neutral-700/90 text-white text-xs font-medium tracking-wide uppercase px-3 py-1.5">
                  {experience.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
