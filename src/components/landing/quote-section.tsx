import Image from "next/image"

export function QuoteSection() {
  return (
    <section className="relative h-max flex items-center justify-center overflow-hidden py-20">
      {/* Background Image */}
      <Image
        src="/landing/quote.jpg"
        alt="Montañas coloridas del Norte Argentino con un vehículo en la ruta"
        fill
        className="object-cover"
        priority={false}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Quote Content */}
      <div className="relative z-10 max-w-full mx-auto px-6 text-center">
        <blockquote>
          <p className="font-serif italic text-white text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-[96px] leading-snug md:leading-relaxed text-balance">
            {
              '"Viajar no es solo trasladarse, sino vivir experiencias que perduren en el tiempo."'
            }
          </p>
          <footer className="ml-0 sm:ml-8 md:ml-20 lg:ml-32 mt-4 text-left">
            <cite className="font-serif italic text-white/90 text-lg md:text-xl lg:text-2xl">
              ~Apacheta Viajes
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
