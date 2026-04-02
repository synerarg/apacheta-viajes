import { redirect } from "next/navigation"

import { OrdersView } from "@/components/account/orders-view"
import { createServerCheckoutController } from "@/controllers/checkout/checkout.controller"
import { createClient } from "@/lib/supabase/server"

export default async function MisReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const checkoutController = await createServerCheckoutController()
  const orders = await checkoutController.listUserOrders({
    id: user.id,
    email: user.email ?? null,
  })

  return (
    <OrdersView
      orders={orders}
      highlightedOrderId={resolvedSearchParams.order ?? null}
    />
  )
}
