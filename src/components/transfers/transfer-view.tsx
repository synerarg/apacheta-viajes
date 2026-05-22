"use client"

import Image from "next/image"
import { Car, Clock, Info, Luggage, MapPin, Route, Users } from "lucide-react"

import { ImageGallery } from "@/components/product/image-gallery"

export type TrasladoTipoServicio = "regular" | "privado"
export type TrasladoModalidad = "ida" | "ida_vuelta" | "punto_a_punto"

export interface TrasladoTarifaRow {
  id: string
  vigencia_label: string | null
  vigencia_desde: string | null
  vigencia_hasta: string | null
  precio_adulto: number
  precio_nino: number | null
  moneda: string | null
  notas: string | null
}

export interface TrasladoViewData {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  descripcion_corta: string | null
  origen: string
  destino: string
  tipo_servicio: TrasladoTipoServicio
  modalidad: TrasladoModalidad
  vehiculo_tipo: string | null
  capacidad_max: number | null
  base_minima_pax: number
  precio_desde: number
  moneda: string
  duracion_minutos: number | null
  incluye_equipaje: boolean | null
  incluye_iva: boolean | null
  impuestos_adicionales_pct: number | null
  imagen_url: string | null
  galeria: string[]
  tarifas: TrasladoTarifaRow[]
}

interface TrasladoViewProps {
  traslado: TrasladoViewData
}

const VEHICULO_LABEL: Record<string, string> = {
  auto: "Auto",
  combi: "Combi",
  minibus: "Minibús",
  camioneta_4x4: "Camioneta 4x4",
  bus: "Bus",
}

const MODALIDAD_LABEL: Record<TrasladoModalidad, string> = {
  ida: "Ida",
  ida_vuelta: "Ida y vuelta",
  punto_a_punto: "Punto a punto",
}

function tipoLabel(tipo: TrasladoTipoServicio) {
  return tipo === "regular" ? "Regular" : "Privado"
}

function formatDuracion(minutos: number | null) {
  if (!minutos || minutos <= 0) return null
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const restantes = minutos % 60

  return restantes === 0 ? `${horas} h` : `${horas} h ${restantes} min`
}

function formatPrice(value: number | null | undefined, moneda: string) {
  if (value === null || value === undefined) return "—"
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: moneda,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${moneda} $${Number(value).toLocaleString("es-AR")}`
  }
}

export function TrasladoView({ traslado }: TrasladoViewProps) {
  const vehiculoLabel = traslado.vehiculo_tipo
    ? VEHICULO_LABEL[traslado.vehiculo_tipo] ?? traslado.vehiculo_tipo
    : null
  const duracionLabel = formatDuracion(traslado.duracion_minutos)
  const heroImage = traslado.imagen_url ?? traslado.galeria[0] ?? null
  const showImpuestos =
    typeof traslado.impuestos_adicionales_pct === "number" &&
    traslado.impuestos_adicionales_pct > 0

  return (
    <main className="min-h-screen bg-off-white pt-28 pb-20">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Page header */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`text-[10px] uppercase tracking-[0.22em] font-sans px-3 py-1 ${
                traslado.tipo_servicio === "privado"
                  ? "bg-primary text-off-white"
                  : "bg-dark-brown/10 text-dark-brown"
              }`}
            >
              {tipoLabel(traslado.tipo_servicio)}
            </span>
            {vehiculoLabel ? (
              <span className="text-[10px] uppercase tracking-[0.22em] font-sans px-3 py-1 bg-dark-brown/10 text-dark-brown">
                {vehiculoLabel}
              </span>
            ) : null}
            <span className="text-[10px] uppercase tracking-[0.22em] font-sans px-3 py-1 bg-dark-brown/10 text-dark-brown">
              {MODALIDAD_LABEL[traslado.modalidad]}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-[64px] font-normal italic text-dark-brown leading-none mb-4">
            {traslado.nombre}
          </h1>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
            <span className="font-sans text-base md:text-xl text-subtle leading-relaxed">
              {traslado.origen}
              <span className="mx-2 text-primary">→</span>
              {traslado.destino}
            </span>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative w-full h-[220px] md:h-[370px] bg-muted mb-12 md:mb-16 overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={traslado.nombre}
              fill
              priority
              className="object-cover"
            />
          ) : null}
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Detalles del servicio */}
            <section className="mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-8">
                Detalles del servicio
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetalleItem
                  icon={<MapPin className="w-5 h-5 text-primary" />}
                  label="Origen"
                  value={traslado.origen}
                />
                <DetalleItem
                  icon={<MapPin className="w-5 h-5 text-primary" />}
                  label="Destino"
                  value={traslado.destino}
                />
                <DetalleItem
                  icon={<Route className="w-5 h-5 text-primary" />}
                  label="Modalidad"
                  value={MODALIDAD_LABEL[traslado.modalidad]}
                />
                {vehiculoLabel ? (
                  <DetalleItem
                    icon={<Car className="w-5 h-5 text-primary" />}
                    label="Vehículo"
                    value={vehiculoLabel}
                  />
                ) : null}
                {traslado.capacidad_max ? (
                  <DetalleItem
                    icon={<Users className="w-5 h-5 text-primary" />}
                    label="Capacidad máxima"
                    value={`${traslado.capacidad_max} pasajeros`}
                  />
                ) : null}
                <DetalleItem
                  icon={<Users className="w-5 h-5 text-primary" />}
                  label="Base mínima"
                  value={`${traslado.base_minima_pax} pax`}
                />
                {duracionLabel ? (
                  <DetalleItem
                    icon={<Clock className="w-5 h-5 text-primary" />}
                    label="Duración estimada"
                    value={duracionLabel}
                  />
                ) : null}
                {traslado.incluye_equipaje !== null ? (
                  <DetalleItem
                    icon={<Luggage className="w-5 h-5 text-primary" />}
                    label="Equipaje"
                    value={traslado.incluye_equipaje ? "Incluido" : "No incluido"}
                  />
                ) : null}
              </div>
            </section>

            {/* Tarifas vigentes */}
            {traslado.tarifas.length > 0 ? (
              <section className="mb-14">
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-8">
                  Tarifas vigentes
                </h2>
                <div className="overflow-x-auto border border-primary/15">
                  <table className="w-full text-left font-sans">
                    <thead className="bg-primary/5">
                      <tr>
                        <th className="px-5 py-3 text-xs uppercase tracking-[0.16em] text-subtle font-medium">
                          Vigencia
                        </th>
                        <th className="px-5 py-3 text-xs uppercase tracking-[0.16em] text-subtle font-medium">
                          Adulto
                        </th>
                        <th className="px-5 py-3 text-xs uppercase tracking-[0.16em] text-subtle font-medium">
                          Niño
                        </th>
                        <th className="px-5 py-3 text-xs uppercase tracking-[0.16em] text-subtle font-medium">
                          Notas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {traslado.tarifas.map((tarifa, index) => {
                        const moneda = tarifa.moneda ?? traslado.moneda
                        const vigencia =
                          tarifa.vigencia_label ??
                          [tarifa.vigencia_desde, tarifa.vigencia_hasta]
                            .filter(Boolean)
                            .join(" — ") ??
                          "Permanente"

                        return (
                          <tr
                            key={tarifa.id}
                            className={
                              index !== traslado.tarifas.length - 1
                                ? "border-b border-primary/15"
                                : ""
                            }
                          >
                            <td className="px-5 py-4 text-sm text-dark-brown">
                              {vigencia}
                            </td>
                            <td className="px-5 py-4 text-sm font-semibold text-primary whitespace-nowrap">
                              {formatPrice(tarifa.precio_adulto, moneda)}
                            </td>
                            <td className="px-5 py-4 text-sm text-dark-brown whitespace-nowrap">
                              {formatPrice(tarifa.precio_nino, moneda)}
                            </td>
                            <td className="px-5 py-4 text-sm text-subtle">
                              {tarifa.notas ?? "—"}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {showImpuestos ? (
                  <div className="mt-4 flex items-start gap-2 text-sm text-subtle font-sans">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      Tarifas + {traslado.impuestos_adicionales_pct}% de impuestos
                      adicionales.
                      {traslado.incluye_iva ? " IVA incluido." : ""}
                    </span>
                  </div>
                ) : null}
              </section>
            ) : null}

            {/* Descripción */}
            {traslado.descripcion ? (
              <section className="mb-14">
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-6">
                  Descripción
                </h2>
                <p className="font-sans text-sm md:text-base text-subtle leading-relaxed whitespace-pre-line">
                  {traslado.descripcion}
                </p>
              </section>
            ) : null}

            {/* Galería */}
            {traslado.galeria.length > 0 ? (
              <section>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-dark-brown mb-8">
                  Galería
                </h2>
                <ImageGallery images={traslado.galeria} alt={traslado.nombre} />
              </section>
            ) : null}
          </div>

          {/* Right sidebar */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-28">
              <div className="border border-primary/20 bg-white p-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-subtle font-sans mb-1">
                  Desde
                </p>
                <p className="font-sans text-3xl md:text-4xl font-bold text-primary mb-1">
                  {formatPrice(traslado.precio_desde, traslado.moneda)}
                </p>
                <p className="text-xs text-subtle font-sans mb-6">
                  por pasajero — base mínima {traslado.base_minima_pax} pax
                </p>

                <div className="flex flex-col gap-3 mb-6 text-sm text-dark-brown font-sans">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-primary" />
                    <span>
                      {vehiculoLabel ?? "Vehículo a confirmar"} · {tipoLabel(traslado.tipo_servicio)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-primary" />
                    <span>{MODALIDAD_LABEL[traslado.modalidad]}</span>
                  </div>
                  {duracionLabel ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{duracionLabel}</span>
                    </div>
                  ) : null}
                </div>

                <a
                  href={`/contacto?asunto=${encodeURIComponent(`Consulta traslado: ${traslado.nombre}`)}`}
                  className="block w-full text-center bg-primary hover:bg-primary/80 text-off-white font-sans text-sm uppercase tracking-[0.16em] px-6 py-3.5 transition-colors"
                >
                  Reservar / Consultar
                </a>

                {showImpuestos ? (
                  <p className="mt-4 text-xs text-subtle font-sans leading-relaxed">
                    Tarifas + {traslado.impuestos_adicionales_pct}% de impuestos
                    adicionales.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

interface DetalleItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function DetalleItem({ icon, label, value }: DetalleItemProps) {
  return (
    <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 px-4 py-4">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.18em] text-subtle font-sans mb-1">
          {label}
        </p>
        <p className="font-sans text-sm font-medium text-dark-brown leading-snug break-words">
          {value}
        </p>
      </div>
    </div>
  )
}
