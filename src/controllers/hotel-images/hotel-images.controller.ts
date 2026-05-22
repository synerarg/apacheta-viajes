import { BaseIdController } from "@/controllers/base/base.controller"
import { createClient } from "@/lib/supabase/server"
import { createHotelImagesRepository } from "@/repositories/hotel-images/hotel-images.repository"
import {
  createHotelImagesService,
  HotelImagesService,
} from "@/services/hotel-images/hotel-images.service"

export class HotelImagesController extends BaseIdController<"hoteles_imagenes"> {
  constructor(service: HotelImagesService) {
    super(service)
  }
}

export async function createServerHotelImagesController() {
  const supabase = await createClient()

  return new HotelImagesController(
    createHotelImagesService(createHotelImagesRepository(supabase)),
  )
}
