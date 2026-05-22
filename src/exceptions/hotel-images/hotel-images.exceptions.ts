import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class HotelImagesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("hoteles_imagenes", operation, cause)
  }
}

export class HotelImagesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("hoteles_imagenes", operation, cause)
  }
}

export class HotelImagesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("hoteles_imagenes", criteria)
  }
}
