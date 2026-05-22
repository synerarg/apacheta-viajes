import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class CategoriasExperienciaRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("categorias_experiencia", operation, cause)
  }
}

export class CategoriasExperienciaServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("categorias_experiencia", operation, cause)
  }
}

export class CategoriasExperienciaNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("categorias_experiencia", criteria)
  }
}
