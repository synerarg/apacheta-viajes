import Link from "next/link"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-36 pb-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/landing/hero.jpg')`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto ">
        {/* Badge */}
        <div className="bg-primary px-4 py-2 rounded mb-8">
          <span className="text-white text-sm font-medium tracking-wide uppercase">
            Tu operador en el Norte Argentino
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white italic leading-tight mb-6 text-balance">
          Operación integral.
          <br />
          Experiencias auténticas.
        </h1>

        {/* Subtitle */}
        <p className="text-white/90 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          Nosotros cuidamos todo para que vos solo disfrutes. Diseñamos
          experiencias a medida por Salta, Jujuy, Tucumán y todo el NOA, con
          flota propia y más de 25 años en destino.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-primary hover:bg-primary/90 hover:text-white border-primary text-white px-8 py-6 text-base"
          >
            <Link href="/#paquetes">Explorar Paquetes</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 hover:text-white bg-transparent px-8 py-6 text-base"
          >
            <Link href="/#contacto">Armar mi viaje</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
