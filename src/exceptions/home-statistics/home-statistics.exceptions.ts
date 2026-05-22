import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class HomeStatisticsRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("estadisticas_home", operation, cause)
  }
}

export class HomeStatisticsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("estadisticas_home", operation, cause)
  }
}

export class HomeStatisticsNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("estadisticas_home", criteria)
  }
}
