import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class EmisivoImagenesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("emisivo_imagenes", operation, cause)
  }
}

export class EmisivoImagenesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("emisivo_imagenes", operation, cause)
  }
}

export class EmisivoImagenesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("emisivo_imagenes", criteria)
  }
}
