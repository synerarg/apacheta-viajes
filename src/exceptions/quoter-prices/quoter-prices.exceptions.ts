import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class QuoterPricesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("cotizador_servicio_precios", operation, cause)
  }
}

export class QuoterPricesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("cotizador_servicio_precios", operation, cause)
  }
}

export class QuoterPricesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("cotizador_servicio_precios", criteria)
  }
}

export class QuoterPricesValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("cotizador_servicio_precios", message, details)
  }
}
