import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class DestinosRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("destinos", operation, cause)
  }
}

export class DestinosServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("destinos", operation, cause)
  }
}

export class DestinosNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("destinos", criteria)
  }
}
