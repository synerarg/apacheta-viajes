import { HeroSection } from "../components/landing/hero-section"
import { MetricsSection } from "../components/landing/metrics-section"
import { AboutSection } from "../components/landing/about-section"
import { PackagesSection } from "../components/landing/packages-section"
import { ExperiencesSection } from "../components/landing/experiences-section"
import { HotelsSection } from "../components/landing/hotels-section"
import { PartnersSection } from "../components/landing/partners-section"
import { ContactSection } from "../components/landing/contact-section"
import { QuoteSection } from "../components/landing/quote-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <AboutSection />
      <PackagesSection />
      <ExperiencesSection />
      <HotelsSection />
      <PartnersSection />
      <ContactSection />
      <QuoteSection />
    </>
  )
}
