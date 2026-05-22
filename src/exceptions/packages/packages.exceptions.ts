import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PaquetesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes", operation, cause)
  }
}

export class PaquetesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes", operation, cause)
  }
}

export class PaquetesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("paquetes", criteria)
  }
}
