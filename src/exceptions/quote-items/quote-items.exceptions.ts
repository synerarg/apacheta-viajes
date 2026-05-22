import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class CotizacionesItemsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("cotizaciones_items", operation, cause)
  }
}

export class CotizacionesItemsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("cotizaciones_items", operation, cause)
  }
}

export class CotizacionesItemsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("cotizaciones_items", criteria)
  }
}

export class CotizacionesItemsValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("cotizaciones_items", message, details)
  }
}
