import { BaseException } from "@/exceptions/base/base.exception"

export class ServiceException extends BaseException {
  constructor(domain: string, operation: string, cause?: unknown) {
    super(`Service error in ${domain}.${operation}`, {
      cause,
      details: {
        domain,
        operation,
      },
    })
  }
}
