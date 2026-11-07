export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'PAYLOAD_TOO_LARGE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'DNS_ERROR'
  | 'DNS_TIMEOUT'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'

export interface ApiErrorBody {
  code: ErrorCode
  message: string
}

export class ApiError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number

  constructor(code: ErrorCode, message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
  }
}

export function validationError(message: string): ApiError {
  return new ApiError('VALIDATION_ERROR', message, 400)
}

export function unauthorizedError(message = 'Unauthorized.'): ApiError {
  return new ApiError('UNAUTHORIZED', message, 401)
}

export function notFoundError(message = 'Endpoint not found.'): ApiError {
  return new ApiError('NOT_FOUND', message, 404)
}

export function payloadTooLargeError(message: string): ApiError {
  return new ApiError('PAYLOAD_TOO_LARGE', message, 413)
}

export function rateLimitError(message = 'Rate limit exceeded.'): ApiError {
  return new ApiError('RATE_LIMIT_EXCEEDED', message, 429)
}

export function internalError(message = 'An unexpected error occurred.'): ApiError {
  return new ApiError('INTERNAL_ERROR', message, 500)
}

export function serviceUnavailableError(message: string): ApiError {
  return new ApiError('SERVICE_UNAVAILABLE', message, 503)
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError
}
