// convex/rateLimit.ts
import { mutation } from "./_generated/server"
import { v } from "convex/values"
import type { MutationCtx } from "./_generated/server"

interface RateLimitEntry {
  email: string
  count: number
  windowStart: number
}

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in ms
const MAX_REQUESTS = 1 // 1 requests per hour per email

export async function checkRateLimit(
  ctx: MutationCtx,
  email: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = Date.now()
  
  // Get existing rate limit entry
  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first()
  
  // No previous requests
  if (!existing) {
    await ctx.db.insert("rateLimits", {
      email,
      count: 1,
      windowStart: now,
    })
    return { allowed: true }
  }
  
  // Check if window expired
  if (now - existing.windowStart > RATE_LIMIT_WINDOW) {
    // Reset window
    await ctx.db.patch(existing._id, {
      count: 1,
      windowStart: now,
    })
    return { allowed: true }
  }
  
  // Within window
  if (existing.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil(
      (existing.windowStart + RATE_LIMIT_WINDOW - now) / 1000
    )
    return { allowed: false, retryAfter }
  }
  
  // Increment count
  await ctx.db.patch(existing._id, {
    count: existing.count + 1,
  })
  
  return { allowed: true }
}

// Mutation that actions can call to check rate limits
export const checkAndUpdateRateLimit = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx: MutationCtx, args: { email: string }) => {
    return await checkRateLimit(ctx, args.email)
  },
})