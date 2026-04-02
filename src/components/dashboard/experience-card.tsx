import Image from "next/image"
import Link from "next/link"
import { PencilSimple, Eye } from "@phosphor-icons/react/dist/ssr"

import { deleteExperiencia } from "@/app/dashboard/experiencias/actions"
import { DeleteItemButton } from "@/components/dashboard/delete-item-button"
import type { ExperienciasRow } from "@/types/experiencias/experiencias.types"

interface ExperienceCardProps {
  experiencia: ExperienciasRow
}

export function ExperienceCard({ experiencia }: ExperienceCardProps) {
  return (
    <div className="group overflow-hidden border border-neutral-200 bg-white">
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
        {experiencia.imagen_url ? (
          <Image
            src={experiencia.imagen_url}
            alt={experiencia.nombre}
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
            {experiencia.nombre}
          </h3>
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
              experiencia.activo
                ? "bg-green-50 text-green-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {experiencia.activo ? "Activo" : "Borrador"}
          </span>
        </div>

        <p className="text-xs text-neutral-500 mb-3">
          {experiencia.duracion_horas
            ? `${experiencia.duracion_horas} hora${experiencia.duracion_horas !== 1 ? "s" : ""}`
            : "Duración no especificada"}
          {experiencia.ubicacion ? ` · ${experiencia.ubicacion}` : ""}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">
            {experiencia.precio
              ? `Desde ${experiencia.moneda ?? "ARS"} $${experiencia.precio.toLocaleString("es-AR")}`
              : "Precio a consultar"}
          </span>

          <div className="flex items-center gap-3 text-neutral-400">
            <Link
              href={`/dashboard/experiencias/${experiencia.id}/editar`}
              className="transition-colors hover:text-neutral-700"
              title="Editar"
            >
              <PencilSimple className="h-4 w-4" />
            </Link>
            <Link
              href={`/experiencias/${experiencia.slug}`}
              target="_blank"
              className="transition-colors hover:text-neutral-700"
              title="Ver en sitio"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <DeleteItemButton
              action={deleteExperiencia.bind(null, experiencia.id)}
              label="Eliminar experiencia"
              redirectTo="/dashboard/experiencias"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
