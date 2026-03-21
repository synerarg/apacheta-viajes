import { NotFoundException } from "@/exceptions/base/not-found.exception"
import { RepositoryException } from "@/exceptions/base/repository.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class CheckoutProfilesRepositoryException extends RepositoryException {
  constructor(operation: string, cause?: unknown) {
    super("checkout_profiles", operation, cause)
  }
}

export class CheckoutProfilesServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("checkout_profiles", operation, cause)
  }
}

export class CheckoutProfilesNotFoundException extends NotFoundException {
  constructor(criteria: string) {
    super("checkout_profiles", criteria)
  }
}
