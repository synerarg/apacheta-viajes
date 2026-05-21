import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons"

export default function SolicitudesLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeaderSkeleton />
      <TableSkeleton rows={6} columns={5} />
    </div>
  )
}
