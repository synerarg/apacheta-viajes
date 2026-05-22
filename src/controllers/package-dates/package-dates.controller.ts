import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPackageDatesRepository } from "@/repositories/package-dates/package-dates.repository"
import {
  createPackageDatesService,
  PackageDatesService,
} from "@/services/package-dates/package-dates.service"

export class PackageDatesController extends BaseIdController<"paquetes_fechas"> {
  constructor(service: PackageDatesService) {
    super(service)
  }
}

export async function createServerPackageDatesController() {
  const supabase = await createClient()

  return new PackageDatesController(
    createPackageDatesService(createPackageDatesRepository(supabase)),
  )
}
