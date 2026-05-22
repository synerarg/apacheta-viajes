import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class QuotesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("cotizaciones", operation, cause)
  }
}

export class QuotesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("cotizaciones", operation, cause)
  }
}

export class QuotesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("cotizaciones", criteria)
  }
}

export class QuotesValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("cotizaciones", message, details)
  }
}
