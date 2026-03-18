import { ServiceException } from "@/exceptions/base/service.exception"

export class NotificationsServiceException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("notifications", operation, cause)
  }
}

export class NotificationsConfigurationException extends ServiceException {
  constructor(operation: string, cause?: unknown) {
    super("notifications", operation, cause)
  }
}
