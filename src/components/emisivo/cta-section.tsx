import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#f2f2f2]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-[#2e2726] mb-6 text-balance">
            ¿Tenés otro destino en mente?
          </h2>
          <p className="text-[#2c2621] text-base md:text-lg mb-10 leading-relaxed">
            Diseñamos experiencias a medida para viajeros exigentes.
            <br className="hidden sm:block" />
            Contanos tu idea y nuestro equipo de emisivo se encargará de la logística.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button
              size="lg"
              className="bg-[#8b1a1a] hover:bg-[#8b1a1a]/90 text-white rounded-none px-8 py-6 text-base font-bold"
            >
              Solicitar Cotización a Medida
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#8b1a1a] text-[#8b1a1a] hover:bg-[#8b1a1a]/5 hover:text-[#8b1a1a] rounded-none px-8 py-6 text-base font-bold"
            >
              Contactar por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
