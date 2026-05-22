import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPackagesRepository } from "@/repositories/packages/packages.repository"
import { createPackagesService, PackagesService } from "@/services/packages/packages.service"

export class PackagesController extends BaseIdController<"paquetes"> {
  constructor(service: PackagesService) {
    super(service)
  }
}

export async function createServerPackagesController() {
  const supabase = await createClient()

  return new PackagesController(
    createPackagesService(createPackagesRepository(supabase)),
  )
}
