import { HeroSection } from "@/components/emisivo/hero-section"
import { DestinationsSection } from "@/components/emisivo/destinations-section"
import { CtaSection } from "@/components/emisivo/cta-section"
import { getEmisivoDestinationsData } from "@/lib/storefront/storefront.server"

export default async function EmisivoPage() {
  const destinations = await getEmisivoDestinationsData()
  const heroImage = destinations[0]?.image ?? "/landing/placeholder-3.png"

  return (
    <main className="bg-[#f2f2f2]">
      <HeroSection image={heroImage} />
      <DestinationsSection destinations={destinations} />
      <CtaSection />
    </main>
  )
}
