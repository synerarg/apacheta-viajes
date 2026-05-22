import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class SolicitudesOperadorRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("solicitudes_operador", operation, cause)
  }
}

export class SolicitudesOperadorServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("solicitudes_operador", operation, cause)
  }
}

export class SolicitudesOperadorNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("solicitudes_operador", criteria)
  }
}

export class SolicitudesOperadorValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("solicitudes_operador", message, details)
  }
}
