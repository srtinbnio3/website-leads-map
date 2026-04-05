import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  leads: defineTable({
    userId: v.id("users"),
    placeId: v.string(),
    displayName: v.string(),
    formattedAddress: v.string(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    primaryType: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    websiteUri: v.optional(v.string()),
    websiteStatus: v.union(
      v.literal("none"),
      v.literal("sns_only"),
      v.literal("external_media_only"),
      v.literal("has_own_website")
    ),
    status: v.union(
      v.literal("未対応"),
      v.literal("営業済"),
      v.literal("返信あり"),
      v.literal("対象外"),
      v.literal("保守契約")
    ),
    memo: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_status", ["userId", "status"])
    .index("by_userId_and_placeId", ["userId", "placeId"]),
});
