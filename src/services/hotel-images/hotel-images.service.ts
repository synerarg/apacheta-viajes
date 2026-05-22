import {
  HotelImagesNotFoundException,
  HotelImagesServiceException,
} from "@/exceptions/hotel-images/hotel-images.exceptions"
import { HotelImagesRepository } from "@/repositories/hotel-images/hotel-images.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  HotelImagesRow,
  HotelImagesUpdate,
} from "@/types/hotel-images/hotel-images.types"

export class HotelImagesService extends BaseService<"hoteles_imagenes"> {
  constructor(repository: HotelImagesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new HotelImagesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new HotelImagesNotFoundException(criteria)
  }

  async getById(id: string): Promise<HotelImagesRow> {
    return this.getOrThrow({ id }, `id ${id}`)
  }

  async updateById(
    id: string,
    payload: HotelImagesUpdate,
  ): Promise<HotelImagesRow> {
    return this.updateByFilters({ id }, payload, `id ${id}`)
  }

  async deleteById(id: string): Promise<void> {
    return this.deleteByFilters({ id })
  }
}

export function createHotelImagesService(
  repository: HotelImagesRepository,
) {
  return new HotelImagesService(repository)
}
