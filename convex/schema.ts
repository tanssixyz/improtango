import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  newsletter: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
  }).index("by_email", ["email"]),
     rateLimits: defineTable({
    email: v.string(),
    count: v.number(),
    windowStart: v.number(),
  }).index("by_email", ["email"]),
  
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),
  // Your other tables...
});
 
export default schema;