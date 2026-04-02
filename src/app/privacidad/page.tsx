import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de privacidad | Apacheta Viajes",
  description: "Política de privacidad de Apacheta Viajes.",
}

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-off-white pb-20 pt-28">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[920px]">
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.16em] text-subtle">
          Legal
        </p>
        <h1 className="mb-6 font-serif text-4xl italic text-dark-brown md:text-5xl">
          Política de privacidad
        </h1>
        <div className="space-y-8 bg-white p-6 sm:p-8 md:p-10">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-dark-brown">
              Datos que recopilamos
            </h2>
            <p className="font-sans text-sm leading-relaxed text-dark-brown">
              Recopilamos los datos necesarios para responder consultas,
              gestionar reservas y dar seguimiento comercial y operativo a cada
              viaje solicitado por el usuario.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-dark-brown">
              Uso de la información
            </h2>
            <p className="font-sans text-sm leading-relaxed text-dark-brown">
              La información se utiliza para contactarte, validar operaciones,
              procesar pagos y brindar asistencia antes, durante y después de la
              contratación de servicios turísticos.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-dark-brown">
              Protección y conservación
            </h2>
            <p className="font-sans text-sm leading-relaxed text-dark-brown">
              Aplicamos medidas razonables para proteger los datos personales y
              los conservamos durante el tiempo necesario para cumplir con fines
              operativos, legales y administrativos vinculados al servicio.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-dark-brown">
              Ejercicio de derechos
            </h2>
            <p className="font-sans text-sm leading-relaxed text-dark-brown">
              Podés solicitar actualización, rectificación o eliminación de tus
              datos escribiendo a
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
