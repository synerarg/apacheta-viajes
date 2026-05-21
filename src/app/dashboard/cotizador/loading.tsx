import {
  PageHeaderSkeleton,
  StatsCardSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons"

export default function CotizadorLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton rows={5} columns={6} />
    </div>
  )
}
