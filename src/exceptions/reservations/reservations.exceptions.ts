import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class ReservationsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("reservas", operation, cause)
  }
}

export class ReservationsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("reservas", operation, cause)
  }
}

export class ReservationsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("reservas", criteria)
  }
}
