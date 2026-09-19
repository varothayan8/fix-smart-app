import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { safetyMeta, type SafetyLevel } from "@/lib/repair-data";

const styles: Record<SafetyLevel, { chip: string; icon: typeof ShieldCheck }> = {
  safe: { chip: "bg-success/15 text-success border-success/30", icon: ShieldCheck },
  caution: { chip: "bg-warning/15 text-warning border-warning/30", icon: AlertTriangle },
  avoid: { chip: "bg-destructive/15 text-destructive border-destructive/30", icon: ShieldAlert },
};

export function SafetyBadge({
  level,
  size = "sm",
  className,
}: {
  level: SafetyLevel;
  size?: "sm" | "lg";
  className?: string;
}) {
  const { chip, icon: Icon } = styles[level];
  const meta = safetyMeta[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-sm",
        chip,
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-3.5" : "size-4"} />
      {size === "sm" ? meta.short : meta.label}
    </span>
  );
}

export function SafetyPanel({ level, note }: { level: SafetyLevel; note: string }) {
  const { icon: Icon } = styles[level];
  const meta = safetyMeta[level];
  const tone =
    level === "safe"
      ? "from-success/25 to-success/5 border-success/30"
      : level === "caution"
        ? "from-warning/25 to-warning/5 border-warning/30"
        : "from-destructive/30 to-destructive/5 border-destructive/40";
  const iconTone =
    level === "safe" ? "text-success" : level === "caution" ? "text-warning" : "text-destructive";
  return (
    <div className={cn("rounded-3xl border bg-gradient-to-br p-5 backdrop-blur-xl", tone)}>
      <div className="flex items-start gap-4">
        <div className={cn("glass-strong flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", iconTone)}>
          <Icon className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Safety level</p>
          <h3 className={cn("mt-0.5 text-lg font-bold", iconTone)}>{meta.label}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{note}</p>
        </div>
      </div>
    </div>
  );
}
