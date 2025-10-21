import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  newsletter: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
  }).index("by_email", ["email"]),
  // Your other tables...
});
 
export default schema;