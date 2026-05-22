import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PackageCategoriesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_categorias", operation, cause)
  }
}

export class PackageCategoriesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_categorias", operation, cause)
  }
}

export class PackageCategoriesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("paquetes_categorias", criteria)
  }
}
