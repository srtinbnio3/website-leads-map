"use client";
import { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MapPanel } from "@/components/MapPanel";
import { BusinessPanel } from "@/components/BusinessPanel";
import { SearchBar } from "@/components/SearchBar";

export default function ProductPage() {
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedPlaceId, setHighlightedPlaceId] = useState<string | null>(null);

  const searchNearby = useAction(api.places.searchNearby);
  const leads = useQuery(api.leads.listLeads, {});
  const savedPlaceIds = new Set((leads ?? []).map((l: any) => l.placeId));

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoError("位置情報の取得に失敗しました。ブラウザの設定を確認してください。")
    );
  }, []);

  const handleSearch = async (keyword: string, radius: number) => {
    if (!location) return;
    setIsSearching(true);
    try {
      const res = await searchNearby({ latitude: location.lat, longitude: location.lng, keyword, radius });
      setResults(res as any[]);
    } finally {
      setIsSearching(false);
    }
  };

  if (geoError) return <div className="flex items-center justify-center h-screen text-red-500">{geoError}</div>;
  if (!location) return <div className="flex items-center justify-center h-screen">位置情報を取得中...</div>;

  return (
    <div className="flex flex-col h-screen">
      <SearchBar onSearch={handleSearch} isSearching={isSearching} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <MapPanel
            center={location}
            businesses={results}
            highlightedPlaceId={highlightedPlaceId}
            onMarkerClick={(placeId: string) => setHighlightedPlaceId(placeId)}
          />
        </div>
        <div className="w-96 border-l overflow-hidden">
          <BusinessPanel
            searchResults={results}
            savedPlaceIds={savedPlaceIds}
            leads={leads ?? []}
            highlightedPlaceId={highlightedPlaceId}
            onCardHighlight={(placeId: string) => setHighlightedPlaceId(placeId)}
          />
        </div>
      </div>
    </div>
  );
}
