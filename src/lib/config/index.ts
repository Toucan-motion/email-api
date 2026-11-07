import { z } from 'zod'

function envNum(def: number, max?: number) {
  let schema = z.coerce.number().int().positive()
  if (max !== undefined) schema = schema.max(max)
  return z.preprocess((v) => (v === '' ? undefined : v), schema.default(def))
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  RAPIDAPI_ORIGIN_SECRET: z
    .string()
    .optional()
    .transform((v) => v ?? ''),

  DNS_TIMEOUT_MS: envNum(5000),
  DNS_CACHE_TTL_MS: envNum(300_000),
  DNS_NEGATIVE_CACHE_TTL_MS: envNum(60_000),
  DNS_MAX_CONCURRENCY: envNum(10),

  BULK_MAX_SIZE: envNum(100, 1000),

  RATE_LIMIT_WINDOW_MS: envNum(60_000),
  RATE_LIMIT_MAX_REQUESTS: envNum(60),
})

export type Env = z.infer<typeof envSchema>

function loadConfig(): Env {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(`Invalid environment configuration:\n${issues}`)
  }
  return result.data
}

let _config: Env | null = null

export function getConfig(): Env {
  if (!_config) {
    _config = loadConfig()
  }
  return _config
}

export function resetConfigForTesting(): void {
  _config = null
}

export const API_VERSION = 'v1'

export const SCORING_WEIGHTS = {
  SYNTAX_VALID: 30,
  DOMAIN_EXISTS: 20,
  MX_FOUND: 20,
  NOT_DISPOSABLE: 20,
  NOT_ROLE_BASED: 5,
  DOMAIN_AGE_SIGNALS: 5,
} as const

export type ScoringWeights = typeof SCORING_WEIGHTS
