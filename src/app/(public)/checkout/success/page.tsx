import { Suspense } from "react"

import { ConfirmacionView } from "@/components/checkout/success"

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmacionView />
    </Suspense>
  )
}
