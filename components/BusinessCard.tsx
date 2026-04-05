"use client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  none: { label: "未登録", variant: "destructive" },
  sns_only: { label: "SNSのみ", variant: "default" },
  external_media_only: { label: "外部媒体", variant: "secondary" },
  has_own_website: { label: "自社HP", variant: "outline" },
};

export function BusinessCard({ business, isSaved, isHighlighted, onClick }: any) {
  const saveLead = useMutation(api.leads.saveLead);
  const statusInfo = STATUS_LABELS[business.websiteStatus] ?? { label: "不明", variant: "outline" as const };

  const handleSave = async (e: React.MouseEvent) => {
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
    <Card className={`cursor-pointer transition-all ${isHighlighted ? "ring-2 ring-primary" : ""}`} onClick={onClick}>
      <CardContent className="p-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-tight">{business.displayName.text}</p>
          <Badge variant={statusInfo.variant} className="shrink-0 text-xs">{statusInfo.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{business.formattedAddress}</p>
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
