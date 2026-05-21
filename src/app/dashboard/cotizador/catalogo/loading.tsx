import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function CatalogoLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5">
      <PageHeaderSkeleton withAction />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-32 rounded-full" />
        ))}
      </div>
      <TableSkeleton rows={6} columns={5} />
    </div>
  )
}
