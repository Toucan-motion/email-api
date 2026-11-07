type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  [key: string]: unknown
}

function redactEmail(email: string): string {
  const atIndex = email.indexOf('@')
  if (atIndex <= 0) return '[redacted]'
  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex + 1)
  const visible = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1)
  return `${visible}***@${domain}`
}

function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (
      key === 'email' &&
      typeof value === 'string' &&
      value.includes('@')
    ) {
      result[key] = redactEmail(value)
    } else if (
      key === 'secret' ||
      key === 'password' ||
      key === 'token' ||
      key === 'authorization'
    ) {
      result[key] = '[redacted]'
    } else {
      result[key] = value
    }
  }
  return result
}

function log(
  level: LogLevel,
  message: string,
  meta: Record<string, unknown> = {}
): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...sanitize(meta),
  }

  const line = JSON.stringify(entry)

  if (level === 'error') {
    console.error(line)
  } else if (level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) =>
    log('debug', msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) =>
    log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) =>
    log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) =>
    log('error', msg, meta),
}

export { redactEmail }
