import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class HotelesImagenesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("hoteles_imagenes", operation, cause)
  }
}

export class HotelesImagenesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("hoteles_imagenes", operation, cause)
  }
}

export class HotelesImagenesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("hoteles_imagenes", criteria)
  }
}
