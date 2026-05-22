import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class OutboundImagesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("emisivo_imagenes", operation, cause)
  }
}

export class OutboundImagesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("emisivo_imagenes", operation, cause)
  }
}

export class OutboundImagesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("emisivo_imagenes", criteria)
  }
}
