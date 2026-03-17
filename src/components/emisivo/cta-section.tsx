import Link from "next/link"

import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28 bg-off-white">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-dark-brown mb-6 text-balance">
            ¿Tenés otro destino en mente?
          </h2>
          <p className="text-dark-brown text-base md:text-lg mb-10 leading-relaxed">
            Diseñamos experiencias a medida para viajeros exigentes.
            <br className="hidden sm:block" />
            Contanos tu idea y nuestro equipo de emisivo se encargará de la logística.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 py-6 text-base font-bold"
            >
              <Link href="/#contacto">Solicitar Cotización a Medida</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 hover:text-primary rounded-none px-8 py-6 text-base font-bold"
            >
              <Link href="https://wa.me/5493875550192" target="_blank">
                Contactar por WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
