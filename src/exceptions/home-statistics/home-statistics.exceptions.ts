import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class EstadisticasHomeRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("estadisticas_home", operation, cause)
  }
}

export class EstadisticasHomeServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("estadisticas_home", operation, cause)
  }
}

export class EstadisticasHomeNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("estadisticas_home", criteria)
  }
}
