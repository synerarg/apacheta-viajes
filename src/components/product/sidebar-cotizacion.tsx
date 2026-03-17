"use client"

import { useState } from "react"
import { Calendar, Clock, Ruler } from "lucide-react"

interface SidebarCotizacionProps {
  precio: number
  moneda: string
  fecha?: string
  duracion: string
  longitud?: string
  tipo: "paquete" | "experiencia"
  onAgregarAlCarro?: () => void
}

export function SidebarCotizacion({
  precio,
  moneda,
  fecha,
  duracion,
  longitud,
  onAgregarAlCarro,
}: SidebarCotizacionProps) {
  const [added, setAdded] = useState(false)

  const handleAgregar = () => {
    setAdded(true)
    onAgregarAlCarro?.()
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="border border-dark-brown/30 bg-white p-8">
      {/* Price header */}
      <div className="mb-6">
        <p className="font-serif text-2xl text-dark-brown mb-1">
          Precio por persona
        </p>
        <p className="text-xs uppercase tracking-wide text-subtle font-sans mb-1">
          Desde
        </p>
        <p className="font-sans text-3xl font-bold text-primary leading-none">
          {moneda} ${precio.toLocaleString("es-AR")}
        </p>
      </div>

      <div className="border-t border-dark-brown/15 my-5" />

      {/* Details */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-subtle font-sans mb-4">
          Detalles
        </p>
        <div className="flex flex-col gap-3">
          {fecha && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-subtle font-sans">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Fecha</span>
              </div>
              <span className="text-sm text-dark-brown font-sans font-medium text-right">
                {fecha}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-subtle font-sans">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Duración</span>
            </div>
            <span className="text-sm text-dark-brown font-sans font-medium text-right">
              {duracion}
            </span>
          </div>
          {longitud && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-subtle font-sans">
                <Ruler className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Longitud</span>
              </div>
              <span className="text-sm text-dark-brown font-sans font-medium text-right">
                {longitud}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-dark-brown/15 my-5" />

      {/* CTA */}
      <button
        onClick={handleAgregar}
        className={`w-full py-4 font-sans text-base font-bold transition-colors ${
          added
            ? "bg-dark-brown text-off-white"
            : "bg-primary hover:bg-primary/80 text-off-white"
        }`}
      >
        {added ? "¡Agregado!" : "Agregar al Carro"}
      </button>

      <p className="mt-4 text-center text-subtle font-sans text-xs leading-relaxed">
        *Sujeto a disponibilidad. Consultar por grupos.
      </p>
    </div>
  )
}
