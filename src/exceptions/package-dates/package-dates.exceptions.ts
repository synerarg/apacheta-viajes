import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PaquetesFechasRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_fechas", operation, cause)
  }
}

export class PaquetesFechasServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_fechas", operation, cause)
  }
}

export class PaquetesFechasNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("paquetes_fechas", criteria)
  }
}
