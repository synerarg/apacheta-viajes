"use client"

import { MapPin, Mail, Phone } from "lucide-react"

import { TravelInquiryForm } from "@/components/shared/travel-inquiry-form"

export function ContactSection() {
  return (
    <section id="contacto" className="py-16 md:py-24">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="font-sans text-xs font-light tracking-[0.2em] uppercase text-subtle mb-3">
            Contacto
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl italic text-dark-brown">
            Hablemos
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-12 lg:gap-20 mx-auto items-start">
          {/* Left Column - Contact Info + Map */}
          <div className="flex flex-col">
            <h3 className="font-serif text-3xl md:text-[40px] font-normal text-dark-brown mb-8">
              Datos de Contacto
            </h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-widest text-subtle mb-1">
                    Oficina Central
                  </p>
                  <p className="font-sans text-base text-dark-brown">
                    Caseros 450, Salta Capital
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-widest text-subtle mb-1">
                    Escribinos
                  </p>
                  <a
                    href="mailto:hola@apacheta.travel"
                    className="font-sans text-base text-dark-brown hover:text-primary transition-colors"
                  >
                    hola@apacheta.travel
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-widest text-subtle mb-1">
                    Llamanos
                  </p>
                  <a
                    href="tel:+5493875550192"
                    className="font-sans text-base text-dark-brown hover:text-primary transition-colors"
                  >
                    +54 9 387 555-0192
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-65.43%2C-24.81%2C-65.38%2C-24.77&layer=mapnik"
                width="100%"
                height="220"
                className="border border-dark-brown block"
                title="Mapa de ubicación - Salta Capital"
              />
              <p className="text-[11px] text-subtle mt-2">
                <a
                  href="https://www.openstreetmap.org/#map=15/-24.79/-65.405"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Datos del mapa © OpenStreetMap contributors
                </a>
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <h3 className="font-serif text-3xl md:text-[40px] font-normal text-dark-brown mb-2">
              Envíenos un mensaje
            </h3>
            <p className="font-sans text-base md:text-lg text-dark-brown mb-8">
              Cuéntenos sobre sus planes de viaje y diseñaremos una experiencia a medida.
            </p>
            <TravelInquiryForm source="landing" />
          </div>
        </div>
      </div>
    </section>
  )
}
