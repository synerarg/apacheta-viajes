import { HeroBanner } from "@/components/ui/hero-banner.component"
import { DestinationCard } from "@/components/ui/destination-card.component"

const destinosEmisivos = [
  {
    id: "peru-camino-inca",
    name: "Perú & Camino Inca",
    description:
      "Machu Picchu, el Valle Sagrado y el Camino Inca en una experiencia mística. Salidas desde Salta con guías especializados.",
    dataSlot: "destino-peru",
  },
  {
    id: "caribe-centroamerica",
    name: "Caribe & Centroamérica",
    description:
      "Playas del Caribe Mexicano, Costa Rica y más. Sol, naturaleza y cultura latina en su máxima expresión.",
    dataSlot: "destino-caribe",
  },
  {
    id: "europa-clasica",
    name: "Europa Clásica",
    description:
      "París, Roma, Barcelona y más. Circuitos para el viajero argentino con guías en español y logística premium.",
    dataSlot: "destino-europa",
  },
  {
    id: "estados-unidos",
    name: "Estados Unidos",
    description:
      "Nueva York, Miami, Las Vegas y los grandes parques. Circuitos flexibles con acompañamiento desde Salta.",
    dataSlot: "destino-eeuu",
  },
]

export default function EmisivoPage() {
  return (
    <main className="bg-off-white min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroBanner
        label="Salidas Grupales & Individuales"
        title="Al mundo desde el Norte"
        subtitle="Conectamos Salta y Jujuy con los destinos más fascinantes del planeta. Sin escalas innecesarias, con la logística experta de Apacheta."
        dataSlot="hero-emisivo"
      />

      {/* ── Destinos Emisivos ─────────────────────────────────────────── */}
      <section className="w-full bg-white py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <p className="font-lato text-[13px] text-primary uppercase tracking-[1.6px] font-light mb-4">
            Destinos
          </p>
          <h2 className="font-playfair text-[48px] md:text-[64px] text-dark-brown font-normal mb-4 leading-tight">
            Destinos Emisivos
          </h2>
          <p className="font-lato text-[20px] text-body-text mb-16 max-w-xl leading-relaxed">
            Programas diseñados desde el NOA para los viajeros más exigentes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {destinosEmisivos.map((destino) => (
              <DestinationCard
                key={destino.id}
                name={destino.name}
                description={destino.description}
                dataSlot={destino.dataSlot}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ────────────────────────────────────────────────── */}
      <section className="w-full bg-off-white py-24">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <h2 className="font-playfair text-[48px] md:text-[64px] text-dark-brown font-normal mb-6 leading-tight">
            ¿Tenés otro destino en mente?
          </h2>
          <p className="font-lato text-[20px] text-body-text mb-12 max-w-2xl mx-auto leading-relaxed">
            Diseñamos experiencias a medida para viajeros exigentes. Contanos tu
            idea y nuestro equipo de emisivo se encargará de la logística.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="/contacto"
              className="bg-primary text-off-white font-lato text-[18px] font-bold px-8 py-4 uppercase tracking-[1.6px] hover:bg-dark-brown transition-colors"
            >
              Hablar con un asesor
            </a>
            <a
              href="https://wa.me/5493875550192"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary text-primary font-lato text-[18px] font-bold px-8 py-4 uppercase tracking-[1.6px] hover:bg-primary hover:text-off-white transition-colors"
            >
              Contacto por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
