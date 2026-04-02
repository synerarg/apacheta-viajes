import type { StorefrontEmisivoDestinationItem } from "@/types/storefront/storefront.types"
import { HeroSection } from "@/components/emisivo/hero-section"
import { DestinationsSection } from "@/components/emisivo/destinations-section"
import { CtaSection } from "@/components/emisivo/cta-section"
import { getEmisivoDestinationsData } from "@/lib/storefront/storefront.server"

const FALLBACK_DESTINATIONS: StorefrontEmisivoDestinationItem[] = [
  {
    id: "peru",
    slug: "peru-camino-inca",
    name: "Perú & Camino Inca",
    description: "Machu Picchu, el Valle Sagrado y la magia andina.",
    image: "/emisivo/peru.png",
    country: "Perú",
    href: "/emisivo",
  },
  {
    id: "caribe",
    slug: "caribe-centroamerica",
    name: "Caribe & Centroamérica",
    description: "Playas cristalinas, cultura vibrante y naturaleza exuberante.",
    image: "/emisivo/caribe.png",
    country: "Caribe",
    href: "/emisivo",
  },
  {
    id: "europa",
    slug: "europa-clasica",
    name: "Europa Clásica",
    description: "Los grandes iconos del viejo continente en un solo viaje.",
    image: "/emisivo/europa.png",
    country: "Europa",
    href: "/emisivo",
  },
  {
    id: "usa",
    slug: "estados-unidos",
    name: "Estados Unidos",
    description: "Nueva York, Miami, Los Ángeles y mucho más.",
    image: "/emisivo/usa.png",
    country: "Estados Unidos",
    href: "/emisivo",
  },
]

export default async function EmisivoPage() {
  const dbDestinations = await getEmisivoDestinationsData()
  const destinations =
    dbDestinations.length > 0 ? dbDestinations : FALLBACK_DESTINATIONS
  const heroImage = "/emisivo/hero.png"

  return (
    <main className="bg-off-white">
      <HeroSection image={heroImage} />
      <DestinationsSection destinations={destinations} />
      <CtaSection />
    </main>
  )
}
