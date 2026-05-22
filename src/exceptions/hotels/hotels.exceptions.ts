import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class HotelesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("hoteles", operation, cause)
  }
}

export class HotelesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("hoteles", operation, cause)
  }
}

export class HotelesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("hoteles", criteria)
  }
}
