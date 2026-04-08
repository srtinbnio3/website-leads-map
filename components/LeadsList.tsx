"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import type { CrmStatus, Lead } from "@/lib/types";

const CRM_STATUSES = ["未対応", "営業済", "返信あり", "対象外", "保守契約"] as const;
const WS_LABELS: Record<string, string> = { none: "未登録", sns_only: "SNSのみ", external_media_only: "外部媒体", has_own_website: "自社HP" };

const WS_VARIANTS: Record<string, string> = {
  none: "ws_none",
  sns_only: "ws_sns",
  external_media_only: "ws_external",
  has_own_website: "ws_own",
};

const CRM_VARIANTS: Record<string, string> = {
  "未対応": "crm_untouched",
  "営業済": "crm_contacted",
  "返信あり": "crm_replied",
  "対象外": "crm_excluded",
  "保守契約": "crm_contracted",
};

export function LeadsList({ leads }: { leads: Lead[] }) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const updateStatus = useMutation(api.leads.updateLeadStatus);
  const deleteLead = useMutation(api.leads.deleteLead);

  const filtered = statusFilter === "all" ? leads : leads.filter((l) => l.status === statusFilter);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b shrink-0">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full h-8 text-xs"><SelectValue placeholder="ステータスで絞り込み" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全て</SelectItem>
            {CRM_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filtered.map((lead) => (
            <Card key={lead._id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-semibold leading-snug truncate">{lead.displayName}</p>
                  <Badge variant={WS_VARIANTS[lead.websiteStatus] as BadgeProps["variant"]} className="text-xs shrink-0">{WS_LABELS[lead.websiteStatus] ?? lead.websiteStatus}</Badge>
                  <Badge variant={CRM_VARIANTS[lead.status] as BadgeProps["variant"]} className="text-xs shrink-0">{lead.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground [word-break:keep-all]">{lead.formattedAddress}</p>
                <div className="flex items-center gap-2">
                  <Select value={lead.status} onValueChange={(v) => updateStatus({ leadId: lead._id, status: v as CrmStatus })}>
                    <SelectTrigger className="flex-1 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CRM_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 hover:text-red-700" onClick={() => deleteLead({ leadId: lead._id })}>削除</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">リードがありません</p>}
        </div>
      </ScrollArea>
    </div>
  );
}
