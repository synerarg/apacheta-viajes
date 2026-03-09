"use client"

import { MapPin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ContactSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Contacto
          </p>
          <h2 className="font-serif text-4xl md:text-5xl italic text-foreground">
            Hablemos
          </h2>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Contact Info */}
          <div>
            <h3 className="text-xl font-medium text-foreground mb-6">
              Datos de Contacto
            </h3>
            
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Oficina Central</p>
                  <p className="text-foreground">Caseros 450, Salta Capital</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Escribinos</p>
                  <a href="mailto:hola@apacheta.travel" className="text-foreground hover:text-primary transition-colors">
                    hola@apacheta.travel
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Llamanos</p>
                  <a href="tel:+5493875550192" className="text-foreground hover:text-primary transition-colors">
                    +54 9 387 555-0192
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14687.441542044857!2d-65.41499!3d-24.7859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc3a0d5a94a3d%3A0x7a7e0c8c7c5c5c5c!2sSalta%2C%20Argentina!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Apacheta Viajes"
                className="grayscale"
              />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              Envíenos un mensaje
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Cuéntenos sobre sus planes de viaje y diseñaremos una experiencia a medida.
            </p>

            <form className="flex flex-col gap-5">
              {/* Row 1 */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">Nombre Completo</label>
                  <input
                    type="text"
                    className="bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">Agencia / Empresa (Opcional)</label>
                  <input
                    type="text"
                    className="bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">Tipo de Viaje</label>
                  <Select>
                    <SelectTrigger className="bg-transparent border-0 border-b border-border rounded-none px-0 py-2 h-auto focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receptivo">Turismo Receptivo</SelectItem>
                      <SelectItem value="emisivo">Turismo Emisivo</SelectItem>
                      <SelectItem value="corporativo">Viaje Corporativo</SelectItem>
                      <SelectItem value="grupos">Grupos</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">Presupuesto Estimado</label>
                  <input
                    type="text"
                    className="bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">Fechas Estimadas</label>
                  <input
                    type="text"
                    className="bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-muted-foreground">Número de Pasajeros Estimado</label>
                  <input
                    type="text"
                    className="bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">Mensaje</label>
                <textarea
                  rows={3}
                  className="bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base mt-2"
              >
                Enviar Solicitud
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
