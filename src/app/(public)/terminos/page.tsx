import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos de servicio | Apacheta Viajes",
  description: "Términos y condiciones de uso de Apacheta Viajes.",
}

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-off-white pb-20 pt-28">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[920px]">
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.16em] text-subtle">
          Legal
        </p>
        <h1 className="mb-6 font-serif text-4xl italic text-dark-brown md:text-5xl">
          Términos de servicio
        </h1>
        <div className="space-y-8 bg-white p-6 sm:p-8 md:p-10">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-dark-brown">
              Uso del sitio
            </h2>
            <p className="font-sans text-sm leading-relaxed text-dark-brown">
              El uso de este sitio implica la aceptación de las condiciones
              generales de navegación, consulta y solicitud de servicios
              turísticos ofrecidos por Apacheta Viajes.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-dark-brown">
              Reservas y disponibilidad
            </h2>
            <p className="font-sans text-sm leading-relaxed text-dark-brown">
              Toda reserva queda sujeta a disponibilidad, validación operativa y
              confirmación del pago correspondiente. Las tarifas publicadas
              pueden modificarse sin previo aviso hasta la confirmación final.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-dark-brown">
              Responsabilidad
            </h2>
            <p className="font-sans text-sm leading-relaxed text-dark-brown">
              Apacheta Viajes actúa como operador y coordinador de servicios
              turísticos. La información enviada por el usuario debe ser veraz y
              suficiente para poder gestionar correctamente cada solicitud.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-dark-brown">Contacto</h2>
            <p className="font-sans text-sm leading-relaxed text-dark-brown">
              Para consultas legales o comerciales podés escribir a
              {" "}
              <a
                href="mailto:hola@apacheta.travel"
                className="text-primary transition-colors hover:underline"
              >
                hola@apacheta.travel
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
