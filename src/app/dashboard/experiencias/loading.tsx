import {
  GridSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/skeletons"

export default function ExperiencesLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeaderSkeleton withAction />
      <GridSkeleton count={6} />
    </div>
  )
}
