import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class TransferRatesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("traslados_tarifas", operation, cause)
  }
}

export class TransferRatesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("traslados_tarifas", operation, cause)
  }
}

export class TransferRatesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("traslados_tarifas", criteria)
  }
}
