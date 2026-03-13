import { createClient } from "@/lib/supabase/server"
import { createCheckoutService, type CheckoutService } from "@/services/checkout/checkout.service"
import type { CheckoutSubmitInput, CheckoutUserContext } from "@/types/checkout/checkout.types"

export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  async submitCheckout(
    input: CheckoutSubmitInput,
    user: CheckoutUserContext | null,
  ) {
    return this.checkoutService.submitCheckout(input, user)
  }
}

export async function createServerCheckoutController() {
  const supabase = await createClient()

  return new CheckoutController(createCheckoutService(supabase))
}
