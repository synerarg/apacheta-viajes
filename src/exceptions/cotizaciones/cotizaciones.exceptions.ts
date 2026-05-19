import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class CotizacionesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("cotizaciones", operation, cause)
  }
}

export class CotizacionesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("cotizaciones", operation, cause)
  }
}

export class CotizacionesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("cotizaciones", criteria)
  }
}

export class CotizacionesValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("cotizaciones", message, details)
  }
}
