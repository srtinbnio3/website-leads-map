"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BusinessCard } from "@/components/BusinessCard";
import { LeadsList } from "@/components/LeadsList";
import type { Lead, SearchResult } from "@/lib/types";

interface BusinessPanelProps {
  searchResults: SearchResult[];
  savedPlaceIds: Set<string>;
  leads: Lead[];
  highlightedPlaceId: string | null;
  onCardHighlight: (placeId: string) => void;
}

export function BusinessPanel({ searchResults, savedPlaceIds, leads, highlightedPlaceId, onCardHighlight }: BusinessPanelProps) {
  return (
    <Tabs defaultValue="search" className="flex flex-col h-full">
      <TabsList className="mx-2 mt-2 shrink-0">
        <TabsTrigger value="search">検索結果 ({searchResults.length})</TabsTrigger>
        <TabsTrigger value="leads">保存済みリード ({leads.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="search" className="flex-1 overflow-hidden m-0">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-2">
            {searchResults.map((b) => (
              <BusinessCard
                key={b.id}
                business={b}
                isSaved={savedPlaceIds.has(b.id)}
                isHighlighted={highlightedPlaceId === b.id}
                onClick={() => onCardHighlight(b.id)}
              />
            ))}
            {searchResults.length === 0 && <p className="text-center text-muted-foreground py-8">検索してください</p>}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="leads" className="flex-1 overflow-hidden m-0">
        <LeadsList leads={leads} />
      </TabsContent>
    </Tabs>
  );
}
