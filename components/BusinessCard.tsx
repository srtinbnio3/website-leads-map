"use client";
import type { MouseEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SearchResult } from "@/lib/types";

const STATUS_LABELS: Record<string, { label: string; variant: "ws_none" | "ws_sns" | "ws_external" | "ws_own" }> = {
  none: { label: "未登録", variant: "ws_none" },
  sns_only: { label: "SNSのみ", variant: "ws_sns" },
  external_media_only: { label: "外部媒体", variant: "ws_external" },
  has_own_website: { label: "自社HP", variant: "ws_own" },
};

interface BusinessCardProps {
  business: SearchResult;
  isSaved: boolean;
  isHighlighted: boolean;
  onClick: () => void;
}

export function BusinessCard({ business, isSaved, isHighlighted, onClick }: BusinessCardProps) {
  const saveLead = useMutation(api.leads.saveLead);
  const statusInfo = STATUS_LABELS[business.websiteStatus] ?? { label: "不明", variant: "ws_none" as const };

  const handleSave = async (e: MouseEvent) => {
    e.stopPropagation();
    await saveLead({
      placeId: business.id,
      displayName: business.displayName.text,
      formattedAddress: business.formattedAddress,
      location: business.location,
      primaryType: business.primaryType,
      phoneNumber: business.nationalPhoneNumber,
      websiteUri: business.websiteUri,
      websiteStatus: business.websiteStatus,
    });
  };

  return (
    <Card className={`cursor-pointer transition-colors hover:border-primary/30 ${isHighlighted ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary))]" : ""}`} onClick={onClick}>
      <CardContent className="p-5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-base font-semibold leading-snug truncate">{business.displayName.text}</p>
          <Badge variant={statusInfo.variant} className="shrink-0 text-xs">{statusInfo.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground [word-break:keep-all]">{business.formattedAddress}</p>
        {business.distance !== undefined && <p className="text-xs text-muted-foreground">{business.distance}m</p>}
        {!isSaved ? (
          <Button size="sm" variant="outline" className="w-full mt-1 text-xs h-7" onClick={handleSave}>
            リードに保存
          </Button>
        ) : (
          <p className="text-xs text-green-600 font-medium">✓ 保存済み</p>
        )}
      </CardContent>
    </Card>
  );
}
