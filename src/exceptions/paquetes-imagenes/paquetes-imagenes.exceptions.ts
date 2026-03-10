import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PaquetesImagenesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_imagenes", operation, cause)
  }
}

export class PaquetesImagenesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_imagenes", operation, cause)
  }
}

export class PaquetesImagenesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("paquetes_imagenes", criteria)
  }
}
