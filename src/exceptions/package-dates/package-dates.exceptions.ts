import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PackageDatesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_fechas", operation, cause)
  }
}

export class PackageDatesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_fechas", operation, cause)
  }
}

export class PackageDatesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("paquetes_fechas", criteria)
  }
}
