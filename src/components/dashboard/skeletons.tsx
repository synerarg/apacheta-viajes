import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function PageHeaderSkeleton({
  withAction = false,
  className,
}: {
  withAction?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        <Skeleton className="h-7 w-44 sm:h-8 sm:w-56" />
        <Skeleton className="h-3 w-64" />
      </div>
      {withAction ? <Skeleton className="h-10 w-40" /> : null}
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="py-5 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

export function GridSkeleton({
  count = 6,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number
  columns?: string
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-5", columns)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="h-40 w-full rounded-none rounded-t-lg" />
          <CardContent className="py-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
  showHeader = true,
}: {
  rows?: number
  columns?: number
  showHeader?: boolean
}) {
  return (
    <Card>
      <div className="overflow-hidden">
        {showHeader ? (
          <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-20" />
            ))}
          </div>
        ) : null}
        <div className="divide-y divide-neutral-100">
          {Array.from({ length: rows }).map((_, r) => (
            <div
              key={r}
              className="px-4 py-3 grid gap-3 items-center"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((_, c) => (
                <Skeleton key={c} className={cn("h-4", c === 0 ? "w-32" : "w-20")} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <Card>
      <CardContent className="py-5 space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="flex justify-end gap-2 pt-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardContent className="py-4 divide-y divide-neutral-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DashboardPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeaderSkeleton withAction />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <ListSkeleton rows={6} />
    </div>
  )
}
