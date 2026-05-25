import { adminClient } from "@/lib/supabase/admin-client"
import { createClient } from "@/lib/supabase/server"
import {
  createHyperGuestRepository,
  type HyperGuestRepository,
} from "@/repositories/hyperguest/hyperguest.repository"
import { createHotelsRepository } from "@/repositories/hotels/hotels.repository"
import {
  createHyperGuestService,
  type HyperGuestService,
} from "@/services/hyperguest/hyperguest.service"
import type { DatabaseClient } from "@/types/database/database.types"
import type {
  HyperGuestAvailabilityInput,
  HyperGuestBookInput,
  HyperGuestCancelInput,
  HyperGuestPrebookInput,
} from "@/types/hyperguest/hyperguest.types"

export class HyperGuestController {
  constructor(
    private readonly hyperGuestService: HyperGuestService,
    private readonly hyperGuestRepository: HyperGuestRepository,
  ) {}

  async syncStaticData() {
    return this.hyperGuestService.syncStaticData()
  }

  async searchAvailability(input: HyperGuestAvailabilityInput) {
    return this.hyperGuestService.searchAvailability(input)
  }

  async prebook(input: HyperGuestPrebookInput) {
    return this.hyperGuestService.prebook(input)
  }

  async book(input: HyperGuestBookInput) {
    return this.hyperGuestService.book(input)
  }

  async cancel(input: HyperGuestCancelInput) {
    return this.hyperGuestService.cancel(input)
  }

  async listProviderBookings(query?: Record<string, string | number | boolean>) {
    return this.hyperGuestService.listProviderBookings(query)
  }

  async listUserReservations(userId: string) {
    return this.hyperGuestService.listUserReservations(userId)
  }

  async getMappingByHotelId(hotelId: string) {
    return this.hyperGuestRepository.findHotelMappingByHotelId(hotelId)
  }
}

function createController(supabase: DatabaseClient) {
  const hyperGuestRepository = createHyperGuestRepository(supabase)
  const hotelsRepository = createHotelsRepository(supabase)

  return new HyperGuestController(
    createHyperGuestService(hyperGuestRepository, hotelsRepository),
    hyperGuestRepository,
  )
}

export async function createServerHyperGuestController() {
  const supabase = await createClient()

  return createController(supabase)
}

export function createAdminHyperGuestController() {
  return createController(adminClient as DatabaseClient)
}
