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

  async getByUsuarioId(usuarioId: string) {
    return this.checkoutProfilesService.getByUsuarioId(usuarioId)
  }

  async upsertByUsuarioId(usuarioId: string, payload: CheckoutProfilesUpdate) {
    return this.checkoutProfilesService.upsertByUsuarioId(usuarioId, payload)
  }

  async deleteByUsuarioId(usuarioId: string) {
    return this.checkoutProfilesService.deleteByUsuarioId(usuarioId)
  }
}

export async function createServerCheckoutProfilesController() {
  return new CheckoutProfilesController(
    createCheckoutProfilesService(
      createCheckoutProfilesRepository(adminClient as DatabaseClient),
    ),
  )
}
