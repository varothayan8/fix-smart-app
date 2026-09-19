import { Link } from "@tanstack/react-router";
import { ChevronRight, CheckCircle2, Clock, HardHat } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { categoryMap, type RepairResult, type RepairStatus } from "@/lib/repair-data";
import { SafetyBadge } from "./SafetyBadge";
import { cn } from "@/lib/utils";

export const statusMeta: Record<
  RepairStatus,
  { label: string; icon: typeof CheckCircle2; tone: string }
> = {
  fixed: { label: "Fixed", icon: CheckCircle2, tone: "text-success" },
  "in-progress": { label: "In progress", icon: Clock, tone: "text-accent" },
  "needs-pro": { label: "Needs a pro", icon: HardHat, tone: "text-destructive" },
};

export function RepairCard({ repair, compact }: { repair: RepairResult; compact?: boolean }) {
  const cat = categoryMap[repair.category];
  const Icon = cat.icon;
  const status = statusMeta[repair.status];
  const StatusIcon = status.icon;

  return (
    <Link
      to="/history/$id"
      params={{ id: repair.id }}
      className={cn(
        "glass pressable hover-lift flex items-center gap-4 rounded-3xl",
        compact ? "p-3.5" : "p-4",
      )}
    >
      <div className="glass-strong flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl text-primary">
        <Icon className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-foreground">{repair.productName}</p>
          {!compact && <SafetyBadge level={repair.safety} />}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{repair.issue}</p>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] font-medium">
          <span className={cn("inline-flex items-center gap-1", status.tone)}>
            <StatusIcon className="size-3.5" />
            {status.label}
          </span>
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(repair.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
