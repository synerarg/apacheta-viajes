import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PackagesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes", operation, cause)
  }
}

export class PackagesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes", operation, cause)
  }
}

export class PackagesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("paquetes", criteria)
  }
}
