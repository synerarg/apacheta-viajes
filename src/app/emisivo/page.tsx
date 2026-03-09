import { HeroSection } from "@/components/emisivo/hero-section"
import { DestinationsSection } from "@/components/emisivo/destinations-section"
import { CtaSection } from "@/components/emisivo/cta-section"

export default function EmisivoPage() {
  return (
    <main className="bg-[#f2f2f2]">
      <HeroSection />
      <DestinationsSection />
      <CtaSection />
    </main>
  )
}
