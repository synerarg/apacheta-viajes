import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PaquetesItinerarioRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_itinerario", operation, cause)
  }
}

export class PaquetesItinerarioServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_itinerario", operation, cause)
  }
}

export class PaquetesItinerarioNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("paquetes_itinerario", criteria)
  }
}
