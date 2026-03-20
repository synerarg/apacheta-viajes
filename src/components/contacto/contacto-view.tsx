"use client"

import { MapPin, Mail, Phone } from "lucide-react"

import { TravelInquiryForm } from "@/components/shared/travel-inquiry-form"

export function ContactoView() {
  return (
    <main className="min-h-screen bg-off-white pt-28 pb-20">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-xs font-light tracking-[0.2em] uppercase text-subtle mb-3">
            Contacto
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-normal italic text-dark-brown">
            Hablemos
          </h1>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-12 lg:gap-20">
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="font-serif text-3xl md:text-[40px] font-normal text-dark-brown mb-8">
              Datos de Contacto
            </h2>

            <div className="space-y-6 mb-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-subtle mb-1">
                    Dirección
                  </p>
                  <p className="font-sans text-base text-dark-brown">
                    Caseros 450, Salta Capital
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-subtle mb-1">
                    Correo
                  </p>
                  <a
                    href="mailto:hola@apacheta.travel"
                    className="font-sans text-base text-dark-brown hover:text-primary transition-colors"
                  >
                    hola@apacheta.travel
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-subtle mb-1">
                    Teléfono
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
                className="border border-dark-brown"
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

          {/* Right Column - Contact Form */}
          <div>
            <h2 className="font-serif text-3xl md:text-[40px] font-normal text-dark-brown mb-2">
              Envíenos un mensaje
            </h2>
            <p className="font-sans text-lg md:text-xl text-dark-brown mb-8">
              Cuéntenos sobre sus planes de viaje y diseñaremos una experiencia a medida.
            </p>
            <TravelInquiryForm source="contacto" />
          </div>
        </div>
      </div>
    </main>
  )
}
