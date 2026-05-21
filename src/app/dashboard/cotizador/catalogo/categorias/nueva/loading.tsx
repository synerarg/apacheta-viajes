import {
  FormSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/skeletons"

export default function NuevaCategoriaLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <PageHeaderSkeleton />
      <FormSkeleton fields={5} />
    </div>
  )
}
