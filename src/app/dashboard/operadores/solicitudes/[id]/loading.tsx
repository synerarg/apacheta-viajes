import {
  FormSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/skeletons"

export default function RequestDetailLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <PageHeaderSkeleton />
      <FormSkeleton fields={6} />
    </div>
  )
}
