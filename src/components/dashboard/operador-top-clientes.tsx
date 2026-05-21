import { Users } from "@phosphor-icons/react/dist/ssr"

interface TopCliente {
  nombre: string
  cantidad: number
  ventaEnviadas: number
}

interface OperadorTopClientesProps {
  clientes: TopCliente[]
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value)
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const initials = parts
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
  return initials || "?"
}

export function OperadorTopClientes({ clientes }: OperadorTopClientesProps) {
  if (clientes.length === 0) {
    return (
      <section className="border border-neutral-200 bg-white p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" weight="duotone" />
          <h2 className="font-playfair text-lg font-semibold text-neutral-900">
            Top clientes
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Users
            className="h-10 w-10 text-neutral-400 opacity-50"
            weight="duotone"
            aria-hidden
          />
          <p className="mt-3 text-sm text-neutral-500">
            Sin clientes registrados aún
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="border border-neutral-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" weight="duotone" />
          <h2 className="font-playfair text-lg font-semibold text-neutral-900">
            Top clientes
          </h2>
        </div>
        <span className="text-xs uppercase tracking-wider text-neutral-500">
          Por venta
        </span>
      </div>
      <ul className="space-y-3">
        {clientes.map((c, idx) => (
          <li
            key={`${c.nombre}-${idx}`}
            className="flex items-center gap-3"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700"
              aria-hidden
            >
              {getInitials(c.nombre)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {c.nombre}
              </p>
              <p className="text-xs text-neutral-500">
                {c.cantidad} cotización{c.cantidad === 1 ? "" : "es"}
              </p>
            </div>
            <span className="shrink-0 tabular-nums text-sm font-medium text-neutral-900">
              {formatMoney(c.ventaEnviadas)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function buildTopClientes(
  cotizaciones: Array<{
    cliente_nombre: string | null
    estado: string
    total_venta: number | null
  }>,
  limit = 5,
): TopCliente[] {
  const map = new Map<string, TopCliente>()
  for (const cot of cotizaciones) {
    const nombre = (cot.cliente_nombre ?? "").trim()
    if (!nombre) continue
    const key = nombre.toLowerCase()
    const current = map.get(key) ?? {
      nombre,
      cantidad: 0,
      ventaEnviadas: 0,
    }
    current.cantidad += 1
    if (cot.estado === "enviada") {
      current.ventaEnviadas += Number(cot.total_venta ?? 0)
    }
    map.set(key, current)
  }
  return Array.from(map.values())
    .sort((a, b) => {
      if (b.cantidad !== a.cantidad) return b.cantidad - a.cantidad
      return b.ventaEnviadas - a.ventaEnviadas
    })
    .slice(0, limit)
}
