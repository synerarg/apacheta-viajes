import { adminClient } from "@/lib/supabase/admin-client"
import { createCheckoutProfilesRepository } from "@/repositories/checkout-profiles/checkout-profiles.repository"
import {
  createCheckoutProfilesService,
  type CheckoutProfilesService,
} from "@/services/checkout-profiles/checkout-profiles.service"
import type { DatabaseClient } from "@/types/database/database.types"
import type { CheckoutProfilesUpdate } from "@/types/checkout-profiles/checkout-profiles.types"

export class CheckoutProfilesController {
  constructor(private readonly checkoutProfilesService: CheckoutProfilesService) {}

  async getByUserId(userId: string) {
    return this.checkoutProfilesService.getByUserId(userId)
  }

  async upsertByUserId(userId: string, payload: CheckoutProfilesUpdate) {
    return this.checkoutProfilesService.upsertByUserId(userId, payload)
  }

  async deleteByUserId(userId: string) {
    return this.checkoutProfilesService.deleteByUserId(userId)
  }
}

export async function createServerCheckoutProfilesController() {
  return new CheckoutProfilesController(
    createCheckoutProfilesService(
      createCheckoutProfilesRepository(adminClient as DatabaseClient),
    ),
  )
}
