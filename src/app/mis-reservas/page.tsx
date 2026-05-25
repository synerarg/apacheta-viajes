import { redirect } from "next/navigation"

import { HotelReservationsList } from "@/components/account/hotel-reservations-list"
import { OrdersView } from "@/components/account/orders-view"
import { createServerCheckoutController } from "@/controllers/checkout/checkout.controller"
import { createServerHyperGuestController } from "@/controllers/hyperguest/hyperguest.controller"
import { createClient } from "@/lib/supabase/server"
import type { HyperGuestReservationSummary } from "@/types/hyperguest/hyperguest.types"

async function safeListHotelReservations(
  userId: string,
): Promise<HyperGuestReservationSummary[]> {
  try {
    const controller = await createServerHyperGuestController()
    return await controller.listUserReservations(userId)
  } catch {
    // Hotel reservations are optional — never break the orders page if HG side fails.
    return []
  }
}

export default async function MisReservationsPage({
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
  const [orders, hotelReservations] = await Promise.all([
    checkoutController.listUserOrders({
      id: user.id,
      email: user.email ?? null,
    }),
    safeListHotelReservations(user.id),
  ])

  return (
    <main className="min-h-screen bg-off-white pb-16 pt-28">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[960px]">
        {hotelReservations.length > 0 ? (
          <HotelReservationsList reservations={hotelReservations} />
        ) : null}
        <OrdersView
          orders={orders}
          highlightedOrderId={resolvedSearchParams.order ?? null}
        />
      </div>
    </main>
  )
}
