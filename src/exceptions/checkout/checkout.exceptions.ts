import { BaseException } from "@/exceptions/base/base.exception"
import { ServiceException } from "@/exceptions/base/service.exception"

export class CheckoutServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("checkout", operation, cause)
  }
}

export class CheckoutAuthenticationException extends BaseException {
  constructor() {
    super("Checkout requires an authenticated user")
  }
}

export class CheckoutValidationException extends BaseException {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, { details })
  }
}
