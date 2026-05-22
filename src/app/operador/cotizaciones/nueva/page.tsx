import { NewQuoteClient } from "@/components/operator/new-quote-client"

export const dynamic = "force-dynamic"

export default function NuevaQuotePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <NewQuoteClient />
    </div>
  )
}
