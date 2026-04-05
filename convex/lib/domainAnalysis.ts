export type WebsiteStatus = "none" | "sns_only" | "external_media_only" | "has_own_website";

const SNS_DOMAINS = ["instagram.com", "facebook.com", "twitter.com", "x.com", "tiktok.com", "youtube.com", "line.me"];
const EXTERNAL_MEDIA_DOMAINS = ["tabelog.com", "hotpepper.jp", "gurunavi.com", "retty.me", "jalan.net", "rakuten.co.jp", "minpaku.com", "airbnb.com"];

function extractHostname(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
  } catch {
    return url.toLowerCase();
  }
}

function matchesDomain(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith("." + domain);
}

export function analyzeWebsiteUri(websiteUri: string | null | undefined): WebsiteStatus {
  if (!websiteUri) return "none";
  const hostname = extractHostname(websiteUri);
  if (SNS_DOMAINS.some(d => matchesDomain(hostname, d))) return "sns_only";
  if (EXTERNAL_MEDIA_DOMAINS.some(d => matchesDomain(hostname, d))) return "external_media_only";
  return "has_own_website";
}
