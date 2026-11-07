import { describe, it, expect, vi } from 'vitest'
import { logger, redactEmail } from '@/lib/logging'

describe('logging - redactEmail', () => {
  it('redacts the local part leaving first 2 chars', () => {
    const result = redactEmail('john.doe@example.com')
    expect(result).toBe('jo***@example.com')
  })

  it('handles short local parts', () => {
    const result = redactEmail('a@example.com')
    expect(result).toBe('a***@example.com')
  })

  it('returns [redacted] for invalid email', () => {
    expect(redactEmail('noemail')).toBe('[redacted]')
    expect(redactEmail('@nolocal.com')).toBe('[redacted]')
  })
})

describe('logging - logger', () => {
  it('calls console.log for info', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    logger.info('test message', { key: 'value' })
    expect(spy).toHaveBeenCalledOnce()
    const arg = spy.mock.calls[0]?.[0] as string
    const parsed = JSON.parse(arg) as Record<string, unknown>
    expect(parsed.level).toBe('info')
    expect(parsed.message).toBe('test message')
    spy.mockRestore()
  })

  it('calls console.error for error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    logger.error('something broke', { code: 500 })
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })

  it('redacts email fields in meta', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    logger.info('request', { email: 'john@example.com' })
    const arg = spy.mock.calls[0]?.[0] as string
    const parsed = JSON.parse(arg) as Record<string, unknown>
    expect(parsed.email).toBe('jo***@example.com')
    spy.mockRestore()
  })

  it('redacts secret fields in meta', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    logger.info('auth', { secret: 'super-secret-value' })
    const arg = spy.mock.calls[0]?.[0] as string
    const parsed = JSON.parse(arg) as Record<string, unknown>
    expect(parsed.secret).toBe('[redacted]')
    spy.mockRestore()
  })
})
