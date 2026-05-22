import {
  GridSkeleton,
  PageHeaderSkeleton,
  StatsCardSkeleton,
} from "@/components/dashboard/skeletons"

export default function OperatorsLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <GridSkeleton count={6} />
    </div>
  )
}
