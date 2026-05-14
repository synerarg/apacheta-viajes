import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class TrasladosTarifasRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("traslados_tarifas", operation, cause)
  }
}

export class TrasladosTarifasServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("traslados_tarifas", operation, cause)
  }
}

export class TrasladosTarifasNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("traslados_tarifas", criteria)
  }
}
