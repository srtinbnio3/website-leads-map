"use client";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const STATUS_COLORS: Record<string, string> = {
  none: "#ef4444",
  sns_only: "#f97316",
  external_media_only: "#eab308",
  has_own_website: "#22c55e",
};

interface Business {
  id: string;
  displayName: { text: string };
  location: { latitude: number; longitude: number };
  websiteStatus: string;
}

interface MapPanelProps {
  center: { lat: number; lng: number };
  businesses: Business[];
  highlightedPlaceId: string | null;
  onMarkerClick: (placeId: string) => void;
}

export function MapPanel({ center, businesses, highlightedPlaceId, onMarkerClick }: MapPanelProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map defaultCenter={center} defaultZoom={15} mapId="wlm-map" className="w-full h-full">
        <AdvancedMarker position={center}>
          <Pin background="#3b82f6" borderColor="#1d4ed8" glyphColor="#fff" />
        </AdvancedMarker>
        {businesses.map((b) => (
          <AdvancedMarker
            key={b.id}
            position={{ lat: b.location.latitude, lng: b.location.longitude }}
            onClick={() => onMarkerClick(b.id)}
          >
            <Pin
              background={STATUS_COLORS[b.websiteStatus] ?? "#6b7280"}
              borderColor={highlightedPlaceId === b.id ? "#000" : undefined}
              scale={highlightedPlaceId === b.id ? 1.3 : 1}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
