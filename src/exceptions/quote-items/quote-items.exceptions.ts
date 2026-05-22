import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class QuoteItemsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("cotizaciones_items", operation, cause)
  }
}

export class QuoteItemsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("cotizaciones_items", operation, cause)
  }
}

export class QuoteItemsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("cotizaciones_items", criteria)
  }
}

export class QuoteItemsValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("cotizaciones_items", message, details)
  }
}
