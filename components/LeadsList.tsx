"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import type { CrmStatus, Lead } from "@/lib/types";

const CRM_STATUSES = ["未対応", "営業済", "返信あり", "対象外", "保守契約"] as const;
const WS_LABELS: Record<string, string> = { none: "未登録", sns_only: "SNSのみ", external_media_only: "外部媒体", has_own_website: "自社HP" };

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
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{lead.displayName}</p>
                  <Badge variant="secondary" className="text-xs shrink-0">{WS_LABELS[lead.websiteStatus] ?? lead.websiteStatus}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{lead.formattedAddress}</p>
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
