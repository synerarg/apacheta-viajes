import { AboutSection } from "@/components/landing/about-section"
import { ContactSection } from "@/components/landing/contact-section"
import { ExperiencesSection } from "@/components/landing/experiences-section"
import { HeroSection } from "@/components/landing/hero-section"
import { HotelsSection } from "@/components/landing/hotels-section"
import { MetricsSection } from "@/components/landing/metrics-section"
import { PackagesSection } from "@/components/landing/packages-section"
import { PartnersSection } from "@/components/landing/partners-section"
import { QuoteSection } from "@/components/landing/quote-section"
import {
  getEmisivoDestinationsData,
  getFeaturedExperienceCategoriesData,
  getFeaturedHotelsData,
  getFeaturedPackagesData,
  getHomeMetricsData,
} from "@/lib/storefront/storefront.server"

export default async function Home() {
  const [metrics, packages, experienceCategories, hotels, emisivoDestinations] =
    await Promise.all([
      getHomeMetricsData(),
      getFeaturedPackagesData(),
      getFeaturedExperienceCategoriesData(),
      getFeaturedHotelsData(),
      getEmisivoDestinationsData(3),
    ])

  return (
    <>
      <HeroSection />
      <MetricsSection metrics={metrics} />
      <AboutSection />
      <PackagesSection packages={packages} />
      <ExperiencesSection experiences={experienceCategories} />
      <HotelsSection hotels={hotels} />
      <PartnersSection destinations={emisivoDestinations} />
      <ContactSection />
      <QuoteSection />
    </>
  )
}
