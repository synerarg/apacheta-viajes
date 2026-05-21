import {
  ChartLineUp,
  Coins,
  FileText,
  PaperPlaneTilt,
} from "@phosphor-icons/react/dist/ssr"

interface OperadorStatsCardsProps {
  total: number
  enviadas: number
  borradores: number
  archivadas: number
  ventaEnviadas: number
  comisionEnviadas: number
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value)
}

interface CardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
}

function Card({ icon, label, value, sub }: CardProps) {
  return (
    <div className="flex items-start gap-4 border border-neutral-200 bg-white p-5">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
          {label}
        </p>
        <p className="mt-1.5 text-2xl font-bold tabular-nums text-neutral-900">
          {value}
        </p>
        <p className="mt-1 text-xs text-neutral-500">{sub}</p>
      </div>
    </div>
  )
}

export function OperadorStatsCards({
  total,
  enviadas,
  borradores,
  archivadas,
  ventaEnviadas,
  comisionEnviadas,
}: OperadorStatsCardsProps) {
  const hasData = total > 0
  const ticketPromedio =
    enviadas > 0 ? ventaEnviadas / enviadas : 0

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        icon={<FileText className="h-5 w-5" weight="duotone" />}
        label="Total cotizaciones"
        value={hasData ? String(total) : "—"}
        sub={
          hasData
            ? `${enviadas} enviadas · ${borradores} en borrador · ${archivadas} archivadas`
            : "Aún no hay cotizaciones"
        }
      />
      <Card
        icon={<PaperPlaneTilt className="h-5 w-5" weight="duotone" />}
        label="Venta enviadas"
        value={enviadas > 0 ? formatMoney(ventaEnviadas) : "—"}
        sub={
          enviadas > 0
            ? `Sobre ${enviadas} cotización${enviadas === 1 ? "" : "es"} enviada${enviadas === 1 ? "" : "s"}`
            : "Sin cotizaciones enviadas"
        }
      />
      <Card
        icon={<Coins className="h-5 w-5" weight="duotone" />}
        label="Comisión enviadas"
        value={enviadas > 0 ? formatMoney(comisionEnviadas) : "—"}
        sub={
          enviadas > 0
            ? "Comisión acumulada de envíos"
            : "Sin comisión generada"
        }
      />
      <Card
        icon={<ChartLineUp className="h-5 w-5" weight="duotone" />}
        label="Ticket promedio"
        value={enviadas > 0 ? formatMoney(ticketPromedio) : "—"}
        sub={
          enviadas > 0
            ? "Venta total enviadas / cantidad"
            : "Necesita cotizaciones enviadas"
        }
      />
    </section>
  )
}
