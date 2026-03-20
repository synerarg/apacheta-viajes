import { BaseException } from "@/exceptions/base/base.exception"

export class ValidationException extends BaseException {
  constructor(domain: string, message: string, details?: Record<string, unknown>) {
    super(message, {
      details: {
        domain,
        ...details,
      },
    })
  }
}
