"use client";

import { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MapPanel } from "@/components/MapPanel";
import { BusinessPanel } from "@/components/BusinessPanel";
import { SearchBar } from "@/components/SearchBar";
import { LoginModal } from "@/components/LoginModal";
import { UserMenu } from "@/components/UserMenu";
import type { Lead, SearchResult } from "@/lib/types";
import { sortSearchResults } from "@/convex/lib/sortResults";

export default function HomePage() {
  const { isAuthenticated } = useConvexAuth();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [radius, setRadius] = useState(1000);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightedPlaceId, setHighlightedPlaceId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastKeyword, setLastKeyword] = useState("");

  const searchNearby = useAction(api.places.searchNearby);
  const leads = useQuery(api.leads.listLeads, isAuthenticated ? {} : "skip");
  const savedPlaceIds = new Set<string>((leads ?? []).map((lead: Lead) => lead.placeId));

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoError("位置情報の取得に失敗しました。ブラウザの設定を確認してください。")
    );
  }, []);

  const handleSearch = async (keyword: string, searchRadius: number) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (!location) return;
    setIsSearching(true);
    setNextPageToken(null);
    setLastKeyword(keyword);
    try {
      const { results: newResults, nextPageToken: token } = await searchNearby({
        latitude: location.lat, longitude: location.lng, keyword, radius: searchRadius,
      });
      setResults(newResults);
      setNextPageToken(token);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadMore = async () => {
    if (!location || !nextPageToken) return;
    setIsLoadingMore(true);
    try {
      const { results: newResults, nextPageToken: token } = await searchNearby({
        latitude: location.lat, longitude: location.lng, keyword: lastKeyword, radius, pageToken: nextPageToken,
      });
      setResults((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const deduped = newResults.filter((r) => !existingIds.has(r.id));
        return sortSearchResults([...prev, ...deduped]);
      });
      setNextPageToken(token);
    } catch {
      setNextPageToken(null);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (geoError) return <div className="flex items-center justify-center h-screen text-red-500">{geoError}</div>;
  if (!location) return <div className="flex items-center justify-center h-screen">位置情報を取得中...</div>;

  return (
    <>
      <SearchBar onSearch={handleSearch} onRadiusChange={setRadius} isSearching={isSearching}>
        {isAuthenticated && <UserMenu>WebsiteLeadsMap</UserMenu>}
      </SearchBar>
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="w-full md:w-[400px] h-[50vh] md:h-auto border-b md:border-b-0 md:border-r order-2 md:order-1 overflow-hidden">
          <BusinessPanel
            searchResults={results}
            savedPlaceIds={savedPlaceIds}
            leads={leads ?? []}
            highlightedPlaceId={highlightedPlaceId}
            onCardHighlight={(placeId: string) => setHighlightedPlaceId(placeId)}
            nextPageToken={nextPageToken}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
          />
        </div>
        <div className="flex-1 h-[50vh] md:h-auto order-1 md:order-2">
          <MapPanel
            center={location}
            radius={radius}
            businesses={results}
            highlightedPlaceId={highlightedPlaceId}
            onMarkerClick={(placeId: string) => setHighlightedPlaceId(placeId)}
          />
        </div>
      </div>
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  );
}
