"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Car, Clock, MapPin, Users } from "lucide-react"

import type { StorefrontTrasladoItem } from "@/lib/storefront/traslados.server"

interface CatalogoTrasladosProps {
  traslados: StorefrontTrasladoItem[]
  origenes: string[]
  tipos: ("regular" | "privado")[]
}

const VEHICULO_LABEL: Record<string, string> = {
  auto: "Auto",
  combi: "Combi",
  minibus: "Minibús",
  camioneta_4x4: "Camioneta 4x4",
  bus: "Bus",
}

const MODALIDAD_LABEL: Record<StorefrontTrasladoItem["modalidad"], string> = {
  ida: "Ida",
  ida_vuelta: "Ida y vuelta",
  punto_a_punto: "Punto a punto",
}

function formatDuracion(minutos: number | null) {
  if (!minutos || minutos <= 0) return null
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const restantes = minutos % 60

  return restantes === 0 ? `${horas} h` : `${horas} h ${restantes} min`
}

function tipoLabel(tipo: "regular" | "privado") {
  return tipo === "regular" ? "Regular" : "Privado"
}

export function CatalogoTraslados({
  traslados,
  origenes,
  tipos,
}: CatalogoTrasladosProps) {
  const [activeOrigen, setActiveOrigen] = useState<string>("Todos")
  const [activeTipo, setActiveTipo] = useState<"todos" | "regular" | "privado">(
    "todos",
  )

  const filtered = useMemo(() => {
    return traslados.filter((traslado) => {
      const origenMatch =
        activeOrigen === "Todos" ||
        traslado.origen.toLowerCase().includes(activeOrigen.toLowerCase())
      const tipoMatch = activeTipo === "todos" || traslado.tipoServicio === activeTipo

      return origenMatch && tipoMatch
    })
  }, [traslados, activeOrigen, activeTipo])

  return (
    <main className="min-h-screen bg-off-white pt-36 pb-20">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.22em] text-subtle font-sans block mb-4">
            Traslados
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-normal italic text-dark-brown mb-5 leading-none">
            Servicios de transfer en el Norte Argentino
          </h1>
          <p className="text-base md:text-xl text-subtle font-sans max-w-2xl leading-relaxed">
            Transfers regulares y privados entre aeropuertos, hoteles y destinos
            turísticos. Operados con vehículos cómodos y conductores
            especializados.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col gap-4">
          {/* Origen filter */}
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-subtle font-sans block mb-3">
              Filtrar por origen
            </span>
            <div className="flex flex-wrap gap-2">
              {origenes.map((origen) => (
                <button
                  key={origen}
                  onClick={() => setActiveOrigen(origen)}
                  className={`px-5 py-2 text-sm font-sans transition-all duration-200 cursor-pointer ${
                    activeOrigen === origen
                      ? "bg-primary text-off-white border border-primary"
                      : "bg-transparent text-dark-brown border border-dark-brown hover:border-primary hover:text-primary"
                  }`}
                >
                  {origen}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo filter */}
          {tipos.length > 0 ? (
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-subtle font-sans block mb-3">
                Filtrar por tipo de servicio
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTipo("todos")}
                  className={`px-5 py-2 text-sm font-sans transition-all duration-200 cursor-pointer ${
                    activeTipo === "todos"
                      ? "bg-primary text-off-white border border-primary"
                      : "bg-transparent text-dark-brown border border-dark-brown hover:border-primary hover:text-primary"
                  }`}
                >
                  Todos
                </button>
                {tipos.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setActiveTipo(tipo)}
                    className={`px-5 py-2 text-sm font-sans transition-all duration-200 cursor-pointer ${
                      activeTipo === tipo
                        ? "bg-primary text-off-white border border-primary"
                        : "bg-transparent text-dark-brown border border-dark-brown hover:border-primary hover:text-primary"
                    }`}
                  >
                    {tipoLabel(tipo)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-subtle font-sans">
              No hay traslados disponibles para los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((traslado) => {
              const duracion = formatDuracion(traslado.duracionMinutos)
              const vehiculo =
                traslado.vehiculoTipo && VEHICULO_LABEL[traslado.vehiculoTipo]
                  ? VEHICULO_LABEL[traslado.vehiculoTipo]
                  : traslado.vehiculoTipo

              return (
                <div
                  key={traslado.id}
                  className="group flex flex-col bg-white border border-dark-brown/10 overflow-hidden transition-colors hover:border-primary/40"
                >
                  {/* Image */}
                  <div className="relative w-full h-[200px] bg-muted overflow-hidden">
                    {traslado.imagen ? (
                      <Image
                        src={traslado.imagen}
                        alt={traslado.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}

                    {/* Tipo badge */}
                    <span
                      className={`absolute top-3 left-3 text-[10px] uppercase tracking-[0.18em] font-sans px-3 py-1 ${
                        traslado.tipoServicio === "privado"
                          ? "bg-primary text-off-white"
                          : "bg-off-white text-dark-brown"
                      }`}
                    >
                      {tipoLabel(traslado.tipoServicio)}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Origen -> Destino */}
                    <div className="flex items-start gap-2 mb-3 text-xs uppercase tracking-[0.16em] text-subtle font-sans">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        {traslado.origen}
                        <span className="mx-1 text-primary">→</span>
                        {traslado.destino}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl md:text-2xl font-medium text-dark-brown leading-tight mb-3">
                      {traslado.nombre}
                    </h3>

                    {/* Description */}
                    {traslado.descripcion ? (
                      <p className="text-sm text-subtle font-sans leading-relaxed line-clamp-2 mb-4">
                        {traslado.descripcion}
                      </p>
                    ) : null}

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5 text-xs text-subtle font-sans">
                      {vehiculo ? (
                        <div className="flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>{vehiculo}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>
                          {traslado.basePax} pax mín.
                        </span>
                      </div>
                      {duracion ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>{duracion}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-[0.16em] text-primary">
                          {MODALIDAD_LABEL[traslado.modalidad]}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t border-dark-brown/10">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-subtle font-sans mb-1">
                          Desde
                        </p>
                        <p className="font-sans text-lg md:text-xl font-bold text-primary">
                          {traslado.moneda} ${traslado.precioDesde.toLocaleString("es-AR")}
                        </p>
                      </div>
                      <Link
                        href={`/traslados/${traslado.slug}`}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-off-white font-sans text-xs uppercase tracking-[0.16em] px-4 py-2.5 transition-colors"
                      >
                        Ver detalle
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
