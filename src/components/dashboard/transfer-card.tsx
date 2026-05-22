import Image from "next/image"
import Link from "next/link"
import { ArrowRight, PencilSimple } from "@phosphor-icons/react/dist/ssr"

import { deleteTraslado } from "@/app/dashboard/traslados/actions"
import { DeleteItemButton } from "@/components/dashboard/delete-item-button"
import type { TransfersRow } from "@/types/transfers/transfers.types"

interface TransferCardProps {
  traslado: TransfersRow
}

function tipoLabel(tipo: TransfersRow["tipo_servicio"]) {
  if (tipo === "privado") return "Privado"
  return "Regular"
}

export function TransferCard({ traslado }: TransferCardProps) {
  return (
    <div className="group overflow-hidden border border-neutral-200 bg-white">
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
        {traslado.imagen_url ? (
          <Image
            src={traslado.imagen_url}
            alt={traslado.nombre}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
        <span className="absolute top-2 left-2 rounded bg-white/90 px-2 py-0.5 text-xs font-medium text-neutral-700">
          {tipoLabel(traslado.tipo_servicio)}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-neutral-800 leading-tight">
            {traslado.nombre}
          </h3>
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
              traslado.activo
                ? "bg-green-50 text-green-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {traslado.activo ? "Activo" : "Borrador"}
          </span>
        </div>

        <p className="mb-3 flex items-center gap-1.5 text-xs text-neutral-500">
          <span>{traslado.origen}</span>
          <ArrowRight className="h-3 w-3" />
          <span>{traslado.destino}</span>
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">
            {traslado.precio_desde
              ? `Desde ${traslado.moneda ?? "ARS"} $${traslado.precio_desde.toLocaleString("es-AR")}`
              : "Precio a consultar"}
          </span>

          <div className="flex items-center gap-3 text-neutral-400">
            <Link
              href={`/dashboard/traslados/${traslado.id}/editar`}
              className="transition-colors hover:text-neutral-700"
              title="Editar"
            >
              <PencilSimple className="h-4 w-4" />
            </Link>
            <DeleteItemButton
              action={deleteTraslado.bind(null, traslado.id)}
              label="Eliminar traslado"
              redirectTo="/dashboard/traslados"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
