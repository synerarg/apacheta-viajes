import Image from "next/image"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="relative h-[480px] overflow-hidden md:h-[560px]">
      <Image
        src="/cta-image.png"
        alt="Paisaje del Norte Argentino"
        fill
        className="object-cover object-center"
        priority={false}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="font-serif text-4xl text-white md:text-5xl lg:text-6xl">
          Tu viaje, a tu medida
        </h2>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
          Contanos qué destinos te interesan, cuántos días tenés y qué tipo de experiencia buscás.
          <br className="hidden md:block" />
          Nuestro equipo diseña el itinerario perfecto para vos.
        </p>
        <Link
          href="#contacto"
          className="mt-8 inline-block bg-[#8b1a1a] px-8 py-3 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#7a1616]"
        >
          Armar mi Viaje
        </Link>
      </div>
    </section>
  )
}
