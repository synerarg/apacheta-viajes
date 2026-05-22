import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class ExperienceCategoriesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("categorias_experiencia", operation, cause)
  }
}

export class ExperienceCategoriesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("categorias_experiencia", operation, cause)
  }
}

export class ExperienceCategoriesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("categorias_experiencia", criteria)
  }
}
