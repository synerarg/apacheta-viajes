import Image from "next/image"

export function HeroSection() {
  return (
    <section className="min-h-[80vh] pt-24 pb-16 bg-off-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-8 lg:gap-12 items-center min-h-[calc(80vh-6rem)]">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center w-full">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Salidas Grupales &amp; Individuales
            </span>
            <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance">
              Al mundo desde el Norte
            </h1>
            <p className="text-dark-brown text-base md:text-lg max-w-md leading-relaxed w-full">
              Conectamos Salta y Jujuy con los destinos más fascinantes del planeta.
              Sin escalas innecesarias, con la logística experta de Apacheta.
            </p>
          </div>

          {/* Right Column - Image: rectangular, no border radius */}
          <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
            <Image
              src=""
              alt="Avión en pista de aeropuerto"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
