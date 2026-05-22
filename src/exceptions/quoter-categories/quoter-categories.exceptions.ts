import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class QuoterCategoriesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("cotizador_categorias", operation, cause)
  }
}

export class QuoterCategoriesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("cotizador_categorias", operation, cause)
  }
}

export class QuoterCategoriesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("cotizador_categorias", criteria)
  }
}

export class QuoterCategoriesValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("cotizador_categorias", message, details)
  }
}
