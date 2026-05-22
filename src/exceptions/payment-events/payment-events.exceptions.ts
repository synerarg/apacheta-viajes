import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PaymentEventsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("pagos_eventos", operation, cause)
  }
}

export class PaymentEventsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("pagos_eventos", operation, cause)
  }
}

export class PaymentEventsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("pagos_eventos", criteria)
  }
}
