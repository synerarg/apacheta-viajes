import { BaseException } from "@/exceptions/base/base.exception"

export class NotFoundException extends BaseException {
  constructor(domain: string, criteria: string) {
    super(`No se encontro ${domain} (${criteria})`, {
      details: {
        domain,
        criteria,
      },
    })
  }
}
