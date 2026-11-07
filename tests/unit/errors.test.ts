import { describe, it, expect } from 'vitest'
import {
  ApiError,
  validationError,
  unauthorizedError,
  notFoundError,
  payloadTooLargeError,
  rateLimitError,
  internalError,
  serviceUnavailableError,
  isApiError,
} from '@/lib/errors'

describe('errors', () => {
  it('creates ApiError with correct properties', () => {
    const err = new ApiError('VALIDATION_ERROR', 'Bad input', 400)
    expect(err.code).toBe('VALIDATION_ERROR')
    expect(err.message).toBe('Bad input')
    expect(err.statusCode).toBe(400)
    expect(err.name).toBe('ApiError')
    expect(err).toBeInstanceOf(Error)
  })

  it('validationError returns 400', () => {
    const err = validationError('Missing email')
    expect(err.statusCode).toBe(400)
    expect(err.code).toBe('VALIDATION_ERROR')
  })

  it('unauthorizedError returns 401', () => {
    const err = unauthorizedError()
    expect(err.statusCode).toBe(401)
    expect(err.code).toBe('UNAUTHORIZED')
  })

  it('notFoundError returns 404', () => {
    const err = notFoundError()
    expect(err.statusCode).toBe(404)
    expect(err.code).toBe('NOT_FOUND')
  })

  it('payloadTooLargeError returns 413', () => {
    const err = payloadTooLargeError('Batch too large')
    expect(err.statusCode).toBe(413)
    expect(err.code).toBe('PAYLOAD_TOO_LARGE')
  })

  it('rateLimitError returns 429', () => {
    const err = rateLimitError()
    expect(err.statusCode).toBe(429)
    expect(err.code).toBe('RATE_LIMIT_EXCEEDED')
  })

  it('internalError returns 500', () => {
    const err = internalError()
    expect(err.statusCode).toBe(500)
    expect(err.code).toBe('INTERNAL_ERROR')
  })

  it('serviceUnavailableError returns 503', () => {
    const err = serviceUnavailableError('DNS temporarily unavailable')
    expect(err.statusCode).toBe(503)
    expect(err.code).toBe('SERVICE_UNAVAILABLE')
  })

  it('isApiError identifies ApiError correctly', () => {
    expect(isApiError(validationError('x'))).toBe(true)
    expect(isApiError(new Error('plain'))).toBe(false)
    expect(isApiError('string')).toBe(false)
    expect(isApiError(null)).toBe(false)
    expect(isApiError(undefined)).toBe(false)
  })
})
