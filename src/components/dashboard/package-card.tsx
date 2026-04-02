import Image from "next/image"
import Link from "next/link"
import { PencilSimple, Eye } from "@phosphor-icons/react/dist/ssr"

import { deletePaquete } from "@/app/dashboard/paquetes/actions"
import { DeleteItemButton } from "@/components/dashboard/delete-item-button"
import type { PaquetesRow } from "@/types/paquetes/paquetes.types"

interface PackageCardProps {
  paquete: PaquetesRow
}

export function PackageCard({ paquete }: PackageCardProps) {
  return (
    <div className="group overflow-hidden border border-neutral-200 bg-white">
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
        {paquete.imagen_url ? (
          <Image
            src={paquete.imagen_url}
            alt={paquete.nombre}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-neutral-800 leading-tight">
            {paquete.nombre}
          </h3>
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
              paquete.activo
                ? "bg-green-50 text-green-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {paquete.activo ? "Activo" : "Borrador"}
          </span>
        </div>

        <p className="text-xs text-neutral-500 mb-3">
          {paquete.duracion_dias} día{paquete.duracion_dias !== 1 ? "s" : ""} /{" "}
          {paquete.duracion_dias - 1} noche{paquete.duracion_dias - 1 !== 1 ? "s" : ""}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">
            Desde {paquete.moneda ?? "ARS"} $
            {paquete.precio_desde.toLocaleString("es-AR")}
          </span>

          <div className="flex items-center gap-3 text-neutral-400">
            <Link
              href={`/dashboard/paquetes/${paquete.id}/editar`}
              className="transition-colors hover:text-neutral-700"
              title="Editar"
            >
              <PencilSimple className="h-4 w-4" />
            </Link>
            <Link
              href={`/paquetes/${paquete.slug}`}
              target="_blank"
              className="transition-colors hover:text-neutral-700"
              title="Ver en sitio"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <DeleteItemButton
              action={deletePaquete.bind(null, paquete.id)}
              label="Eliminar paquete"
              redirectTo="/dashboard/paquetes"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
