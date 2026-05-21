import { AboutSection } from "@/components/landing/about-section"
import { ContactSection } from "@/components/landing/contact-section"
import { CtaSection } from "@/components/landing/cta-section"
import { ExperiencesSection } from "@/components/landing/experiences-section"
import { HeroSection } from "@/components/landing/hero-section"
import { HotelsSection } from "@/components/landing/hotels-section"
import { MetricsSection } from "@/components/landing/metrics-section"
import { PackagesSection } from "@/components/landing/packages-section"
import { PartnersSection } from "@/components/landing/partners-section"
import { QuoteSection } from "@/components/landing/quote-section"
import { TrasladosSection } from "@/components/landing/traslados-section"
import {
  getEmisivoDestinationsData,
  getFeaturedHotelsData,
  getFeaturedPackagesData,
  getHomeMetricsData,
} from "@/lib/storefront/storefront.server"
import { getFeaturedTrasladosData } from "@/lib/storefront/traslados.server"

export default async function Home() {
  const [metrics, packages, hotels, traslados, emisivoDestinations] =
    await Promise.all([
      getHomeMetricsData(),
      getFeaturedPackagesData(),
      getFeaturedHotelsData(),
      getFeaturedTrasladosData(),
      getEmisivoDestinationsData(3),
    ])

  return (
    <>
      <HeroSection />
      <MetricsSection metrics={metrics} />
      <AboutSection />
      <PackagesSection packages={packages} />
      <ExperiencesSection />
      <HotelsSection hotels={hotels} />
      <TrasladosSection traslados={traslados} />
      <PartnersSection destinations={emisivoDestinations} />
      <CtaSection />
      <ContactSection />
      <QuoteSection />
    </>
  )
}
