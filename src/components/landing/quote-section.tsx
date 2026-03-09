import Image from "next/image"

export function QuoteSection() {
  return (
    <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-V4OsfP122lK7sfA05JCXdMoXcql2mr.png"
        alt="Montañas coloridas del Norte Argentino con un vehículo en la ruta"
        fill
        className="object-cover"
        priority={false}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Quote Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <blockquote>
          <p className="font-serif italic text-white text-2xl md:text-3xl lg:text-4xl leading-relaxed text-balance">
            {
              '"Viajar no es solo trasladarse, sino vivir experiencias que perduren en el tiempo."'
            }
          </p>
          <footer className="mt-6">
            <cite className="font-serif italic text-white/90 text-lg md:text-xl">
              ~Apacheta Viajes
            </cite>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
