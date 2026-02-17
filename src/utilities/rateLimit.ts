type RateLimitConfig = {
  key: string
  windowMs: number
  maxHits: number
}

type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  retryAfterSec: number
}

type GlobalWithRateLimitStore = typeof globalThis & {
  __xksRateLimitStore?: Map<string, number[]>
}

const getStore = (): Map<string, number[]> => {
  const globalRef = globalThis as GlobalWithRateLimitStore
  if (!globalRef.__xksRateLimitStore) {
    globalRef.__xksRateLimitStore = new Map<string, number[]>()
  }

  return globalRef.__xksRateLimitStore
}

export const takeRateLimit = ({ key, windowMs, maxHits }: RateLimitConfig): RateLimitResult => {
  const store = getStore()
  const now = Date.now()
  const oldestAllowed = now - windowMs

  const currentHits = (store.get(key) || []).filter((timestamp) => timestamp > oldestAllowed)

  if (currentHits.length >= maxHits) {
    const retryAfterMs = Math.max(0, currentHits[0] + windowMs - now)
    return {
      allowed: false,
      limit: maxHits,
      remaining: 0,
      retryAfterSec: Math.ceil(retryAfterMs / 1000),
    }
  }

  currentHits.push(now)
  store.set(key, currentHits)

  return {
    allowed: true,
    limit: maxHits,
    remaining: Math.max(0, maxHits - currentHits.length),
    retryAfterSec: 0,
  }
}
