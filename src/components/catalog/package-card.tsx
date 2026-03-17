import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

import type { StorefrontPackageItem } from "@/types/storefront/storefront.types"

interface PackageCardProps {
  paquete: StorefrontPackageItem
}

export function PackageCard({ paquete }: PackageCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-0 border-b border-dark-brown/15 pb-10 mb-10">
      {/* Image */}
      <div className="relative w-full md:w-[572px] h-[220px] md:h-[313px] flex-shrink-0 overflow-hidden bg-muted">
        {paquete.image && (
          <Image
            src={paquete.image}
            alt={paquete.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 md:pl-10 flex flex-col justify-between pt-5 md:pt-0">
        <div>
          {/* Category tag */}
          <span className="text-xs uppercase tracking-[0.18em] text-subtle font-sans block mb-2">
            {paquete.category}
          </span>

          {/* Title */}
          <h3 className="font-serif text-2xl md:text-3xl font-medium text-dark-brown mb-4 leading-tight">
            {paquete.name}
          </h3>

          {/* Meta */}
          <div className="flex flex-wrap gap-5 mb-4">
            {paquete.departureLabel && (
              <div className="flex items-center gap-2 text-sm text-subtle font-sans">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{paquete.departureLabel}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-subtle font-sans">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span>
                {paquete.durationDays}{" "}
                {paquete.durationDays === 1 ? "día" : "días"}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base text-subtle font-sans leading-relaxed line-clamp-3 mb-6">
            {paquete.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <Link
            href={`/paquetes/${paquete.slug}`}
            className="inline-block bg-primary hover:bg-primary/80 text-off-white font-sans text-sm px-6 py-3 transition-colors w-fit"
          >
            Ver Detalle
          </Link>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-subtle font-sans mb-1">
              Desde
            </p>
            <p className="font-sans text-2xl md:text-3xl font-bold text-primary">
              {paquete.currency} ${paquete.price.toLocaleString("es-AR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
