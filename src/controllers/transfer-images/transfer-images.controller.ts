import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createTransferImagesRepository } from "@/repositories/transfer-images/transfer-images.repository"
import {
  createTransferImagesService,
  TransferImagesService,
} from "@/services/transfer-images/transfer-images.service"

export class TransferImagesController extends BaseIdController<"traslados_imagenes"> {
  constructor(service: TransferImagesService) {
    super(service)
  }
}

export async function createServerTransferImagesController() {
  const supabase = await createClient()

  return new TransferImagesController(
    createTransferImagesService(createTransferImagesRepository(supabase)),
  )
}
