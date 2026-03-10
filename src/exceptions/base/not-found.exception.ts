import { BaseException } from "@/exceptions/base/base.exception"

export class NotFoundException extends BaseException {
  constructor(domain: string, criteria: string) {
    super(`${domain} not found (${criteria})`, {
      details: {
        domain,
        criteria,
      },
    })
  }
}
