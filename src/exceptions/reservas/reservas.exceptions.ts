import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class ReservasRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("reservas", operation, cause)
  }
}

export class ReservasServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("reservas", operation, cause)
  }
}

export class ReservasNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("reservas", criteria)
  }
}
