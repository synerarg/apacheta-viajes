import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createPackageImagesRepository } from "@/repositories/package-images/package-images.repository"
import {
  createPackageImagesService,
  PackageImagesService,
} from "@/services/package-images/package-images.service"

export class PackageImagesController extends BaseIdController<"paquetes_imagenes"> {
  constructor(service: PackageImagesService) {
    super(service)
  }
}

export async function createServerPackageImagesController() {
  const supabase = await createClient()

  return new PackageImagesController(
    createPackageImagesService(createPackageImagesRepository(supabase)),
  )
}
