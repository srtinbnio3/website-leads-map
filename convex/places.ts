import { v } from "convex/values";
import { action } from "./_generated/server";
import { fetchNearbyPlaces } from "./lib/placesApi";
import { analyzeWebsiteUri } from "./lib/domainAnalysis";
import { sortSearchResults } from "./lib/sortResults";

function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000; // meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const searchNearby = action({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    keyword: v.optional(v.string()),
    radius: v.number(),
    pageToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not configured");

    const { places, nextPageToken } = await fetchNearbyPlaces(args, apiKey);

    const results = sortSearchResults(
      places.map((place) => ({
        ...place,
        websiteStatus: analyzeWebsiteUri(place.websiteUri),
        distance: Math.round(
          haversineDistance(args.latitude, args.longitude, place.location.latitude, place.location.longitude)
        ),
      }))
    );

    return { results, nextPageToken };
  },
});
