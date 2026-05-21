import {
  FormSkeleton,
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons"

export default function CotizacionDetailLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-5xl">
      <PageHeaderSkeleton />
      <FormSkeleton fields={4} />
      <TableSkeleton rows={5} columns={5} />
    </div>
  )
}
