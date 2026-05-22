import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class QuoterServicesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("cotizador_servicios", operation, cause)
  }
}

export class QuoterServicesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("cotizador_servicios", operation, cause)
  }
}

export class QuoterServicesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("cotizador_servicios", criteria)
  }
}

export class QuoterServicesValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("cotizador_servicios", message, details)
  }
}
