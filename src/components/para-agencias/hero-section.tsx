import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600')`,
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto pt-20">
        <p className="text-xs tracking-[0.25em] uppercase text-white/70 mb-4">
          Portal Exclusivo B2B
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white italic leading-tight mb-6 text-balance">
          Tu Partner Operativo
          <br />
          en el Norte Argentino
        </h1>
        <p className="text-white/80 text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
          Infraestructura propia y logística de precisión para operadores exigentes.
          Somos sus ojos y pies en el terreno. Garantizamos la ejecución impecable
          que su marca requiere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base cursor-pointer"
          >
            Ver Tarifario
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 bg-transparent px-8 py-6 text-base cursor-pointer hover:text-white"
          >
            Hablar con Gerencia
          </Button>
        </div>
      </div>
    </section>
  )
}
