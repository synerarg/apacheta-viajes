import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"
import { ValidationException } from "@/exceptions/base/validation.exception"

export class CotizadorCategoriasRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("cotizador_categorias", operation, cause)
  }
}

export class CotizadorCategoriasServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("cotizador_categorias", operation, cause)
  }
}

export class CotizadorCategoriasNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("cotizador_categorias", criteria)
  }
}

export class CotizadorCategoriasValidationException extends ValidationException {
  constructor(message: string, details?: Record<string, unknown>) {
    super("cotizador_categorias", message, details)
  }
}
