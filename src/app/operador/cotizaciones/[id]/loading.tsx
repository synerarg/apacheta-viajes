import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CotizacionBuilderLoading() {
  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto pb-32 lg:pb-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <div className="flex items-center gap-2 pl-11 sm:pl-0">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </header>

      <div className="grid gap-5 lg:gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5 min-w-0">
          <Card>
            <CardContent className="space-y-4 py-4 sm:py-5">
              <Skeleton className="h-4 w-40" />
              <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 py-4 sm:py-5">
              <Skeleton className="h-4 w-32" />
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Skeleton className="h-4 w-44" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="bg-neutral-50 border-b border-neutral-100 px-4 py-3 flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <CardContent className="py-4 space-y-3">
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-neutral-100">
                    <Skeleton className="h-9 w-40" />
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-6 self-start space-y-4">
          <Card>
            <CardContent className="py-5 space-y-3">
              <Skeleton className="h-4 w-24" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between gap-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
              <Skeleton className="h-10 w-full mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5 space-y-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
