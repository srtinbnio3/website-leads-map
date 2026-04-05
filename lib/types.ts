import type { Doc } from "@/convex/_generated/dataModel";
import type { PlaceResult } from "@/convex/lib/placesApi";

export type Lead = Doc<"leads">;
export type WebsiteStatus = Lead["websiteStatus"];
export type CrmStatus = Lead["status"];

export type SearchResult = PlaceResult & {
  websiteStatus: WebsiteStatus;
  distance: number;
};
