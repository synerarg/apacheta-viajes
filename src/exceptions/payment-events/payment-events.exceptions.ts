import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PagosEventosRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("pagos_eventos", operation, cause)
  }
}

export class PagosEventosServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("pagos_eventos", operation, cause)
  }
}

export class PagosEventosNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("pagos_eventos", criteria)
  }
}
