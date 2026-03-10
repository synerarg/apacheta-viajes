import { BaseException } from "@/exceptions/base/base.exception"

export class RepositoryException extends BaseException {
  constructor(domain: string, operation: string, cause?: unknown) {
    super(`Repository error in ${domain}.${operation}`, {
      cause,
      details: {
        domain,
        operation,
      },
    })
  }
}
