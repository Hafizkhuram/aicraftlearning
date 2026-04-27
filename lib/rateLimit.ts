// Simple in-memory sliding-window rate limiter, keyed by (scope, identifier).
// Per-process: on Railway with a single instance this is sufficient as a
// basic abuse defence. If we ever scale horizontally, swap to Upstash/Redis.

type Bucket = number[]; // timestamps (ms) of recent hits

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  scope: string,
  id: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const key = `${scope}:${id}`;
  const now = Date.now();
  const cutoff = now - windowMs;

  const existing = buckets.get(key) ?? [];
  const recent = existing.filter((ts) => ts > cutoff);

  if (recent.length >= max) {
    const oldest = recent[0];
    return {
      ok: false,
      remaining: 0,
      resetAt: oldest + windowMs,
    };
  }

  recent.push(now);
  buckets.set(key, recent);

  return {
    ok: true,
    remaining: max - recent.length,
    resetAt: now + windowMs,
  };
}
