export interface PlaceResult {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  location: { latitude: number; longitude: number };
  primaryType?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
}

export async function fetchNearbyPlaces(
  args: { latitude: number; longitude: number; keyword?: string; radius: number },
  apiKey: string
): Promise<PlaceResult[]> {
  const body = {
    textQuery: args.keyword || "近くのお店",
    locationBias: {
      circle: {
        center: { latitude: args.latitude, longitude: args.longitude },
        radius: Math.min(args.radius, 5000),
      },
    },
    languageCode: "ja",
  };

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.nationalPhoneNumber,places.websiteUri",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Places API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return (data.places ?? []) as PlaceResult[];
}
