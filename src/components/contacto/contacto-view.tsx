"use client"

import { useState } from "react"
import { MapPin, Mail, Phone, ChevronDown } from "lucide-react"

export function ContactoView() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tipoViaje: "",
    presupuesto: "",
    fechas: "",
    pasajeros: "",
    mensaje: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <main className="min-h-screen bg-off-white pt-28 pb-20">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-xs font-light tracking-[0.2em] uppercase text-subtle mb-3">
            Contacto
          </p>
          <h1 className="font-serif text-5xl md:text-[64px] font-normal italic text-dark-brown">
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

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre Completo"
                  autoComplete="name"
                  className="w-full bg-transparent border-0 border-b border-dark-brown rounded-none px-0 py-3 font-sans text-base text-dark-brown placeholder:text-subtle focus:outline-none focus:border-b-2 focus:border-primary transition-all"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo Electrónico"
                  autoComplete="email"
                  className="w-full bg-transparent border-0 border-b border-dark-brown rounded-none px-0 py-3 font-sans text-base text-dark-brown placeholder:text-subtle focus:outline-none focus:border-b-2 focus:border-primary transition-all"
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <select
                    name="tipoViaje"
                    value={formData.tipoViaje}
                    onChange={handleChange}
                    autoComplete="off"
                    className="w-full bg-transparent border-0 border-b border-dark-brown rounded-none px-0 py-3 font-sans text-base text-dark-brown focus:outline-none focus:border-b-2 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Tipo de Viaje</option>
                    <option value="paquete-noa">Paquete NOA</option>
                    <option value="experiencia">Experiencia</option>
                    <option value="hoteleria">Hotelería</option>
                    <option value="emisivo">Emisivo</option>
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-brown pointer-events-none" />
                </div>
                <input
                  type="text"
                  name="presupuesto"
                  value={formData.presupuesto}
                  onChange={handleChange}
                  placeholder="Presupuesto Estimado"
                  autoComplete="off"
                  className="w-full bg-transparent border-0 border-b border-dark-brown rounded-none px-0 py-3 font-sans text-base text-dark-brown placeholder:text-subtle focus:outline-none focus:border-b-2 focus:border-primary transition-all"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="fechas"
                  value={formData.fechas}
                  onChange={handleChange}
                  placeholder="Fechas Estimadas"
                  autoComplete="off"
                  className="w-full bg-transparent border-0 border-b border-dark-brown rounded-none px-0 py-3 font-sans text-base text-dark-brown placeholder:text-subtle focus:outline-none focus:border-b-2 focus:border-primary transition-all"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  name="pasajeros"
                  value={formData.pasajeros}
                  onChange={handleChange}
                  placeholder="Número de Pasajeros"
                  autoComplete="off"
                  className="w-full bg-transparent border-0 border-b border-dark-brown rounded-none px-0 py-3 font-sans text-base text-dark-brown placeholder:text-subtle focus:outline-none focus:border-b-2 focus:border-primary transition-all"
                />
              </div>

              {/* Row 4 - Message */}
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Mensaje"
                rows={5}
                autoComplete="off"
                className="w-full bg-transparent border-0 border-b border-dark-brown rounded-none px-0 py-3 font-sans text-base text-dark-brown placeholder:text-subtle focus:outline-none focus:border-b-2 focus:border-primary transition-all resize-none"
              />

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 text-off-white font-sans text-lg font-bold py-4 rounded-none transition-colors"
              >
                Enviar Solicitud
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
