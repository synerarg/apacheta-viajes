import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons"

export default function TrasladosLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeaderSkeleton withAction />
      <TableSkeleton rows={6} columns={5} />
    </div>
  )
}
