import { Truck, Users, Clock, MapPin, Mail, Phone, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroBanner } from "@/components/ui/hero-banner.component";
import { ServiceCard } from "@/components/ui/service-card.component";
import { ContactForm } from "@/components/ui/contact-form.component";
import type { LucideIcon } from "lucide-react";

const serviceIcons: Record<string, LucideIcon> = {
  "logistica-integral": Truck,
  "flota-propia": Users,
  "soporte-247": Clock,
};

const serviciosDmc = [
  {
    id: "logistica-integral",
    title: "Logística Integral",
    description:
      "Coordinación total de transfers, hotelería y expediciones. Desde la recepción en aeropuerto hasta la despedida, gestionamos cada minuto con precisión cronométrica.",
    bullets: [
      "Flota propia de camionetas 4x4",
      "Guías bilingües especializados",
      "Coordinación 360° del itinerario",
    ],
  },
  {
    id: "flota-propia",
    title: "Flota Propia",
    description:
      "Vehículos propios e infraestructura logística bajo nuestro control directo. Sin dependencia de terceros, con estándares de confort y seguridad garantizados.",
    bullets: [
      "Mantenimiento preventivo certificado",
      "Choferes habilitados y experimentados",
      "Cobertura de seguro completa",
    ],
  },
  {
    id: "soporte-247",
    title: "Soporte 24/7",
    description:
      "Resolución de incidencias en tiempo real. Un equipo de guardia permanente monitoreando cada movimiento de sus pasajeros en la puna y valles.",
    bullets: [
      "Línea directa para emergencias",
      "Respuesta en menos de 15 minutos",
      "Gestión de contingencias en destino",
    ],
  },
];

const porQueElegirBullets = [
  {
    title: "Flota propia",
    description:
      "Camionetas 4x4 propias y choferes en relación de dependencia. No dependemos de proveedores externos para la operación de su grupo.",
  },
  {
    title: "Diseño a medida",
    description:
      "Cada itinerario es único. Diseñamos experiencias pensadas para el perfil específico de cada grupo, sin paquetes genéricos ni soluciones estándar.",
  },
  {
    title: "25 años de experiencia",
    description:
      "Fundados en 1997 en Salta Capital. Conocemos el NOA como nadie: los caminos, los tiempos, los proveedores de confianza y los secretos del territorio.",
  },
  {
    title: "Logística completa",
    description:
      "Nos encargamos de cada detalle: transfers, hotelería, guías, permisos y contingencias. Usted vende, nosotros ejecutamos con precisión.",
  },
];

const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.512!2d-65.4117!3d-24.7859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc2e53d2b1f57%3A0x4a956792c26e1ede!2sCaseros%20450%2C%20A4400%20Salta!5e0!3m2!1ses!2sar!4v1709900000000!5m2!1ses!2sar";

export default function ParaAgenciasPage() {
  return (
    <main className="bg-off-white min-h-screen">
      <Navbar />

      <HeroBanner
        label="Portal Exclusivo B2B"
        title="Tu Partner Operativo en el Norte Argentino"
        subtitle="Infraestructura propia y logística de precisión para operadores exigentes. Somos sus ojos y pies en el terreno."
        dataSlot="hero-para-agencias"
      />

      <section className="w-full bg-white py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <p className="font-lato text-[13px] text-primary uppercase tracking-[1.6px] font-light mb-4">
            Servicios
          </p>
          <h2 className="font-playfair text-[48px] md:text-[64px] text-dark-brown font-normal mb-4 leading-tight">
            Servicios DMC
          </h2>
          <p className="font-lato text-[20px] text-body-text mb-16 max-w-xl leading-relaxed">
            Excelencia operativa diseñada para integrarse invisiblemente con su agencia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviciosDmc.map((service) => {
              const Icon = serviceIcons[service.id] ?? Truck;
              return (
                <ServiceCard
                  key={service.id}
                  icon={Icon}
                  title={service.title}
                  description={service.description}
                  bullets={service.bullets}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-off-white py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-playfair text-[48px] md:text-[64px] text-dark-brown font-normal mb-12 leading-tight">
                Por qué elegir Apacheta
              </h2>
              <ul className="flex flex-col gap-10">
                {porQueElegirBullets.map((item, index) => (
                  <li key={index} className="flex gap-5 items-start">
                    <div className="w-10 h-10 bg-dark-brown flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle size={20} className="text-off-white" />
                    </div>
                    <div>
                      <h3 className="font-playfair text-[22px] text-primary font-normal mb-2">
                        {item.title}
                      </h3>
                      <p className="font-lato text-[16px] text-body-text leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full h-[580px] bg-muted overflow-hidden sticky top-24">
              <img
                data-slot="por-que-elegir-apacheta"
                src=""
                alt="Por qué elegir Apacheta"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-24">
        <div className="max-w-[1440px] mx-auto px-8">
          <p className="font-lato text-[13px] text-primary uppercase tracking-[1.6px] font-light mb-4 text-center">
            Contacto
          </p>
          <h2 className="font-playfair text-[48px] md:text-[64px] text-dark-brown font-normal mb-20 text-center leading-tight">
            Hablemos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-playfair text-[36px] text-dark-brown font-normal mb-10">
                Datos de Contacto
              </h3>

              <ul className="flex flex-col gap-7 mb-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-dark-brown flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-off-white" />
                  </div>
                  <div>
                    <p className="font-lato text-[11px] text-dark-brown uppercase tracking-[1px] font-medium mb-1">
                      Oficina Central
                    </p>
                    <p className="font-lato text-[16px] text-body-text">
                      Caseros 450, Salta Capital
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-dark-brown flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-off-white" />
                  </div>
                  <div>
                    <p className="font-lato text-[11px] text-dark-brown uppercase tracking-[1px] font-medium mb-1">
                      Escribinos
                    </p>
                    <a
                      href="mailto:hola@apacheta.travel"
                      className="font-lato text-[16px] text-body-text hover:text-primary transition-colors"
                    >
                      hola@apacheta.travel
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-dark-brown flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-off-white" />
                  </div>
                  <div>
                    <p className="font-lato text-[11px] text-dark-brown uppercase tracking-[1px] font-medium mb-1">
                      Llamanos
                    </p>
                    <a
                      href="tel:+5493875550192"
                      className="font-lato text-[16px] text-body-text hover:text-primary transition-colors"
                    >
                      +54 9 387 555-0192
                    </a>
                  </div>
                </li>
              </ul>

              <div className="w-full h-[280px] border border-primary overflow-hidden">
                <iframe
                  src={MAP_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa Apacheta Viajes — Caseros 450, Salta"
                />
              </div>
            </div>

            <div>
              <h3 className="font-playfair text-[36px] text-dark-brown font-normal mb-4">
                Envianos un mensaje
              </h3>
              <p className="font-lato text-[18px] text-body-text mb-10 leading-relaxed">
                Cuéntenos sobre sus grupos y diseñaremos una propuesta operativa a medida.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
