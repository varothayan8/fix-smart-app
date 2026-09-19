import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { GlassCard } from "./GlassCard";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <GlassCard className="rise flex flex-col items-center px-6 py-10 text-center">
      <div className="relative mb-5">
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
        <div className="bg-gradient-primary relative flex h-16 w-16 items-center justify-center rounded-3xl shadow-glow">
          <Icon className="size-7 text-primary-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </GlassCard>
  );
}
