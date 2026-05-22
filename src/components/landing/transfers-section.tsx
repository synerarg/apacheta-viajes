import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Car, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { StorefrontTrasladoItem } from "@/lib/storefront/traslados.server"

interface TrasladosSectionProps {
  traslados: StorefrontTrasladoItem[]
}

const VEHICULO_LABEL: Record<string, string> = {
  auto: "Auto",
  combi: "Combi",
  minibus: "Minibús",
  camioneta_4x4: "Camioneta 4x4",
  bus: "Bus",
}

function tipoLabel(tipo: "regular" | "privado") {
  return tipo === "regular" ? "Regular" : "Privado"
}

export function TrasladosSection({ traslados }: TrasladosSectionProps) {
  return (
    <section id="traslados" className="py-16 md:py-24 bg-stone-50/50">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Últimas publicaciones
          </p>
          <h2 className="font-serif text-4xl italic text-foreground md:text-5xl">
            Traslados
          </h2>
        </div>

        {traslados.length > 0 ? (
          <div className="mx-auto grid gap-8 md:grid-cols-3">
            {traslados.map((traslado) => {
              const vehiculo =
                traslado.vehiculoTipo && VEHICULO_LABEL[traslado.vehiculoTipo]
                  ? VEHICULO_LABEL[traslado.vehiculoTipo]
                  : traslado.vehiculoTipo

              return (
                <Link
                  key={traslado.id}
                  href={`/traslados/${traslado.slug}`}
                  className="group block"
                >
                  <div className="relative mb-4 aspect-4/5 overflow-hidden rounded-lg bg-stone-100">
                    {traslado.imagen ? (
                      <Image
                        src={traslado.imagen}
                        alt={traslado.nombre}
                        width={400}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center font-sans text-sm text-muted-foreground">
                        Imagen en actualización
                      </div>
                    )}
                    <span
                      className={`absolute left-3 top-3 px-3 py-1 text-[10px] font-sans uppercase tracking-[0.18em] ${
                        traslado.tipoServicio === "privado"
                          ? "bg-primary text-white"
                          : "bg-white text-foreground"
                      }`}
                    >
                      {tipoLabel(traslado.tipoServicio)}
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                    <span className="leading-relaxed">
                      {traslado.origen}
                      <span className="mx-1 text-primary">→</span>
                      {traslado.destino}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-foreground">
                    {traslado.nombre}
                  </h3>

                  <div className="mt-2 flex items-center justify-between gap-3 text-sm text-muted-foreground">
                    {vehiculo ? (
                      <div className="flex items-center gap-1.5">
                        <Car className="h-3.5 w-3.5 text-primary" />
                        <span>{vehiculo}</span>
                      </div>
                    ) : (
                      <span />
                    )}
                    <span className="font-sans text-sm font-semibold text-primary">
                      Desde {traslado.moneda} $
                      {traslado.precioDesde.toLocaleString("es-AR")}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-xl border border-border bg-background px-6 py-10 text-center">
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              Estamos sumando nuevos traslados al catálogo. Consultanos y te
              enviamos opciones disponibles.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Link href="/traslados">
            <Button
              variant="default"
              size="lg"
              className="bg-primary text-white text-base h-12 px-4 hover:bg-primary/90 cursor-pointer"
            >
              Ver Traslados Completos
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
