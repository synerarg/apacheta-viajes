import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { StorefrontExperienceItem } from "@/types/storefront/storefront.types"

interface ExperienciaCardProps {
  experiencia: StorefrontExperienceItem
  className?: string
}

export function ExperienciaCard({
  experiencia,
  className = "",
}: ExperienciaCardProps) {
  return (
    <Link
      href={`/experiencias/${experiencia.slug}`}
      className={`group relative overflow-hidden block bg-muted ${className}`}
    >
      {/* Image */}
      {experiencia.image && (
        <Image
          src={experiencia.image}
          alt={experiencia.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <span className="text-xs uppercase tracking-[0.18em] text-off-white/80 font-sans block mb-2">
          {experiencia.category}
        </span>
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-serif text-xl md:text-2xl font-medium text-off-white leading-tight">
            {experiencia.name}
          </h3>
          <div className="flex-shrink-0 w-8 h-8 border border-off-white/60 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
            <ArrowRight className="w-4 h-4 text-off-white" />
          </div>
        </div>
      </div>
    </Link>
  )
}
