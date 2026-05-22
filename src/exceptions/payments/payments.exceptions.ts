import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PaymentsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("pagos", operation, cause)
  }
}

export class PaymentsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("pagos", operation, cause)
  }
}

export class PaymentsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("pagos", criteria)
  }
}
