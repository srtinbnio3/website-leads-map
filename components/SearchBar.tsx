"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SearchBar({ onSearch, isSearching }: { onSearch: (k: string, r: number) => void; isSearching: boolean }) {
  const [keyword, setKeyword] = useState("");
  const [radius, setRadius] = useState(1000);
  return (
    <div className="flex gap-2 p-3 border-b bg-background items-center">
      <Input placeholder="業種・キーワード（任意）" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="max-w-xs" />
      <Select value={String(radius)} onValueChange={(v: string) => setRadius(Number(v))}>
        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="500">500m</SelectItem>
          <SelectItem value="1000">1km</SelectItem>
          <SelectItem value="2000">2km</SelectItem>
          <SelectItem value="5000">5km</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={() => onSearch(keyword, radius)} disabled={isSearching}>
        {isSearching ? "検索中..." : "検索"}
      </Button>
    </div>
  );
}
