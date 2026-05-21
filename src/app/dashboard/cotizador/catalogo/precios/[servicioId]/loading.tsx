import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons"

export default function PreciosLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5">
      <PageHeaderSkeleton withAction />
      <TableSkeleton rows={4} columns={6} />
    </div>
  )
}
