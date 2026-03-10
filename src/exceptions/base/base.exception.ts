export interface BaseExceptionOptions {
  cause?: unknown
  details?: Record<string, unknown>
}

export class BaseException extends Error {
  readonly details?: Record<string, unknown>

  constructor(message: string, options: BaseExceptionOptions = {}) {
    super(message)

    this.name = new.target.name
    this.cause = options.cause
    this.details = options.details
  }
}
