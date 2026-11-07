import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { resetConfigForTesting } from '@/lib/config'

describe('config', () => {
  beforeEach(() => {
    resetConfigForTesting()
  })

  afterEach(() => {
    resetConfigForTesting()
    vi.unstubAllEnvs()
  })

  it('returns defaults when no env vars set', async () => {
    vi.stubEnv('DNS_TIMEOUT_MS', '')
    vi.stubEnv('BULK_MAX_SIZE', '')

    const { getConfig } = await import('@/lib/config')
    const cfg = getConfig()

    expect(cfg.DNS_TIMEOUT_MS).toBe(5000)
    expect(cfg.DNS_CACHE_TTL_MS).toBe(300_000)
    expect(cfg.DNS_NEGATIVE_CACHE_TTL_MS).toBe(60_000)
    expect(cfg.DNS_MAX_CONCURRENCY).toBe(10)
    expect(cfg.BULK_MAX_SIZE).toBe(100)
    expect(cfg.RATE_LIMIT_WINDOW_MS).toBe(60_000)
    expect(cfg.RATE_LIMIT_MAX_REQUESTS).toBe(60)
  })

  it('reads custom numeric values from env', async () => {
    vi.stubEnv('DNS_TIMEOUT_MS', '3000')
    vi.stubEnv('BULK_MAX_SIZE', '50')

    resetConfigForTesting()
    const { getConfig } = await import('@/lib/config')
    const cfg = getConfig()

    expect(cfg.DNS_TIMEOUT_MS).toBe(3000)
    expect(cfg.BULK_MAX_SIZE).toBe(50)
  })

  it('caches config on repeated calls', async () => {
    const { getConfig } = await import('@/lib/config')
    const a = getConfig()
    const b = getConfig()
    expect(a).toBe(b)
  })

  it('API_VERSION is v1', async () => {
    const { API_VERSION } = await import('@/lib/config')
    expect(API_VERSION).toBe('v1')
  })

  it('SCORING_WEIGHTS sum to 100', async () => {
    const { SCORING_WEIGHTS } = await import('@/lib/config')
    const total = Object.values(SCORING_WEIGHTS).reduce((s, v) => s + v, 0)
    expect(total).toBe(100)
  })
})
