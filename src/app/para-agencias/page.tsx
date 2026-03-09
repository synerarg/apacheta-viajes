import { Navbar } from "@/components/layout/navbar"
import { HeroSection } from "@/components/para-agencias/hero-section"
import { ServicesSection } from "@/components/para-agencias/services-section"
import { WhyChooseSection } from "@/components/para-agencias/why-choose-section"
import { ContactSection } from "@/components/para-agencias/contact-section"

export default function ParaAgenciasPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyChooseSection />
        <ContactSection />
      </main>
    </>
  )
}
