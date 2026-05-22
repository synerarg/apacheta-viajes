import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class OperatorTypesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("tipos_operador", operation, cause)
  }
}

export class OperatorTypesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("tipos_operador", operation, cause)
  }
}

export class OperatorTypesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("tipos_operador", criteria)
  }
}

export class OperatorTypesValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("tipos_operador", message, details)
  }
}
