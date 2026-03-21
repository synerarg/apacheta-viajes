import { adminClient } from "@/lib/supabase/admin-client"
import { createCheckoutService, type CheckoutService } from "@/services/checkout/checkout.service"
import type { DatabaseClient } from "@/types/database/database.types"
import type { CheckoutSubmitInput, CheckoutUserContext } from "@/types/checkout/checkout.types"

export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  async submitCheckout(
    input: CheckoutSubmitInput,
    user: CheckoutUserContext | null,
  ) {
    return this.checkoutService.submitCheckout(input, user)
  }

  async getOrderSummary(orderId: string, user: CheckoutUserContext | null) {
    return this.checkoutService.getOrderSummary(orderId, user)
  }

  async listUserOrders(user: CheckoutUserContext | null) {
    return this.checkoutService.listUserOrders(user)
  }

  async getSavedProfile(user: CheckoutUserContext | null) {
    return this.checkoutService.getSavedProfile(user)
  }
}

export async function createServerCheckoutController() {
  return new CheckoutController(
    createCheckoutService(adminClient as DatabaseClient),
  )
}
