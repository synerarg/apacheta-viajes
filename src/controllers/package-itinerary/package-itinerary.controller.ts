import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPackageItineraryRepository } from "@/repositories/package-itinerary/package-itinerary.repository"
import {
  createPackageItineraryService,
  PackageItineraryService,
} from "@/services/package-itinerary/package-itinerary.service"

export class PackageItineraryController extends BaseIdController<"paquetes_itinerario"> {
  constructor(service: PackageItineraryService) {
    super(service)
  }
}

export async function createServerPackageItineraryController() {
  const supabase = await createClient()

  return new PackageItineraryController(
    createPackageItineraryService(
      createPackageItineraryRepository(supabase),
    ),
  )
}
