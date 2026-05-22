import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function QuotesAdminLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeaderSkeleton />
      <div className="mb-5 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <TableSkeleton rows={8} columns={6} />
    </div>
  )
}
