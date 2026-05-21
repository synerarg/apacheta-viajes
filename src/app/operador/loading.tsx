import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function OperadorLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeaderSkeleton withAction />
      <div className="mb-5 flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      <TableSkeleton rows={6} columns={5} />
    </div>
  )
}
