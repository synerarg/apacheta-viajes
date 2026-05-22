import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PaquetesCategoriasRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_categorias", operation, cause)
  }
}

export class PaquetesCategoriasServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_categorias", operation, cause)
  }
}

export class PaquetesCategoriasNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("paquetes_categorias", criteria)
  }
}
