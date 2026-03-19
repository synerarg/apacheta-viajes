import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export interface RecentItem {
  id: string
  nombre: string
  tipo: "Paquete" | "Experiencia"
  activo: boolean | null
  imagen_url: string | null
  created_at: string | null
  editHref: string
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} minuto${mins !== 1 ? "s" : ""}`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hora${hours !== 1 ? "s" : ""}`
  const days = Math.floor(hours / 24)
  return `${days} día${days !== 1 ? "s" : ""}`
}

interface RecentItemsListProps {
  items: RecentItem[]
}

export function RecentItemsList({ items }: RecentItemsListProps) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        No hay elementos recientes.
      </p>
    )
  }

  return (
    <div className="divide-y divide-neutral-100">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 py-3">
          <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-neutral-100">
            {item.imagen_url ? (
              <Image
                src={item.imagen_url}
                alt={item.nombre}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="h-full w-full bg-neutral-200" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-white">
                {item.tipo}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-800 truncate">{item.nombre}</p>
            {item.created_at && (
              <p className="text-xs text-neutral-500">
                Hace {relativeTime(item.created_at)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`rounded px-2 py-1 text-xs font-medium ${
                item.activo
                  ? "bg-green-50 text-green-700"
                  : "bg-neutral-100 text-neutral-500"
              }`}
            >
              {item.activo ? "Activo" : "Borrador"}
            </span>
            <Link
              href={item.editHref}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Editar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
