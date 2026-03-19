interface StatsCardProps {
  icon: React.ReactNode
  label: string
  sublabel: string
  value: number
}

export function StatsCard({ icon, label, sublabel, value }: StatsCardProps) {
  return (
    <div className="flex items-center gap-4 border border-neutral-200 p-5">
      <div className="flex h-12 w-12 items-center justify-center bg-primary text-white shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-800">{label}</p>
        <p className="text-xs text-neutral-500">{sublabel}</p>
      </div>
      <span className="text-4xl font-light text-primary tabular-nums">{value}</span>
    </div>
  )
}
