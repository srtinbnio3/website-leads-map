import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const CRM_STATUS = v.union(
  v.literal("未対応"),
  v.literal("営業済"),
  v.literal("返信あり"),
  v.literal("対象外"),
  v.literal("保守契約")
);

const WEBSITE_STATUS = v.union(
  v.literal("none"),
  v.literal("sns_only"),
  v.literal("external_media_only"),
  v.literal("has_own_website")
);

export const saveLead = mutation({
  args: {
    placeId: v.string(),
    displayName: v.string(),
    formattedAddress: v.string(),
    location: v.object({ latitude: v.number(), longitude: v.number() }),
    primaryType: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    websiteUri: v.optional(v.string()),
    websiteStatus: WEBSITE_STATUS,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_userId_and_placeId", (q) => q.eq("userId", userId).eq("placeId", args.placeId))
      .unique();
    if (existing) throw new Error("Already saved");
    return await ctx.db.insert("leads", { ...args, userId, status: "未対応" });
  },
});

export const updateLeadStatus = mutation({
  args: { leadId: v.id("leads"), status: CRM_STATUS },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const lead = await ctx.db.get(args.leadId);
    if (!lead || lead.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.leadId, { status: args.status });
  },
});

export const updateLeadMemo = mutation({
  args: { leadId: v.id("leads"), memo: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const lead = await ctx.db.get(args.leadId);
    if (!lead || lead.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.leadId, { memo: args.memo });
  },
});

export const deleteLead = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const lead = await ctx.db.get(args.leadId);
    if (!lead || lead.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.leadId);
  },
});

export const listLeads = query({
  args: { status: v.optional(CRM_STATUS) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    if (args.status) {
      return await ctx.db
        .query("leads")
        .withIndex("by_userId_and_status", (q) => q.eq("userId", userId).eq("status", args.status!))
        .order("desc")
        .take(200);
    }
    return await ctx.db
      .query("leads")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(200);
  },
});
