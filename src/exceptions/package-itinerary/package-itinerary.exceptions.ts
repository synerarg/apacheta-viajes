import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class PackageItineraryRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_itinerario", operation, cause)
  }
}

export class PackageItineraryServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("paquetes_itinerario", operation, cause)
  }
}

export class PackageItineraryNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("paquetes_itinerario", criteria)
  }
}
