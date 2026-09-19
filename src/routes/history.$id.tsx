import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  HardHat,
  Wrench,
  Share2,
  Trash2,
  Leaf,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { BottomNav } from "@/components/app/BottomNav";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SafetyBadge, SafetyPanel } from "@/components/app/SafetyBadge";
import { Button } from "@/components/ui/button";
import { categoryMap, type RepairStatus } from "@/lib/repair-data";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history/$id")({ component: RepairDetailPage });

const statusOptions: { id: RepairStatus; label: string; icon: typeof CheckCircle2; tone: string }[] =
  [
    { id: "in-progress", label: "In Progress", icon: Clock, tone: "text-accent" },
    { id: "fixed", label: "Mark Fixed ✓", icon: CheckCircle2, tone: "text-success" },
    { id: "needs-pro", label: "Needs a Pro", icon: HardHat, tone: "text-destructive" },
  ];

function RepairDetailPage() {
  const { id } = Route.useParams();
  const { history, updateStatus, removeRepair } = useApp();
  const navigate = useNavigate();
  const repair = history.find((r) => r.id === id);

  const [checked, setChecked] = useState<Record<number, boolean>>({});

  if (!repair) {
    return (
      <div className="bg-app flex min-h-dvh items-center justify-center px-4">
        <GlassCard className="max-w-sm text-center">
          <p className="font-semibold text-foreground">Repair not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have been deleted.
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/history" })}>
            Back to history
          </Button>
        </GlassCard>
      </div>
    );
  }

  const cat = categoryMap[repair.category];
  const Icon = cat.icon;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allDone = repair.steps.length > 0 && checkedCount === repair.steps.length;

  const handleShare = async () => {
    const text = `ReVive repair: ${repair.productName} — ${repair.issue}`;
    if (navigator.share) {
      await navigator.share({ title: "ReVive Repair", text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      toast.success("Link copied!");
    }
  };

  const handleDelete = () => {
    removeRepair(id);
    toast("Repair removed");
    navigate({ to: "/history" });
  };

  return (
    <div className="bg-app min-h-dvh">
      <div className="relative mx-auto max-w-md px-4 pb-32 pt-4">
        <PageHeader
          backTo="/history"
          title={repair.productName}
          eyebrow={cat.label}
          action={
            <button
              onClick={handleShare}
              className="glass flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="Share"
            >
              <Share2 className="size-4" />
            </button>
          }
        />

        {/* Meta */}
        <div className="rise mb-5 flex flex-wrap items-center gap-2">
          <SafetyBadge level={repair.safety} />
          <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            <Icon className="size-3.5" /> {cat.label}
          </span>
          <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            <Clock className="size-3.5" /> {repair.timeEstimate}
          </span>
          <span className="glass inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            {repair.difficulty}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(repair.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Safety */}
        <div className="rise mb-4" style={{ animationDelay: "40ms" }}>
          <SafetyPanel level={repair.safety} note={repair.safetyNote} />
        </div>

        {/* Summary */}
        <GlassCard className="rise mb-4 space-y-2" style={{ animationDelay: "80ms" }}>
          <h2 className="font-semibold text-foreground">{repair.issue}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{repair.summary}</p>
        </GlassCard>

        {/* Tools */}
        {repair.tools.length > 0 && repair.tools[0] !== "None — do not open" && (
          <div className="rise mb-4" style={{ animationDelay: "100ms" }}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Tools needed
            </h3>
            <div className="flex flex-wrap gap-2">
              {repair.tools.map((t) => (
                <span
                  key={t}
                  className="glass-strong rounded-full px-3 py-1.5 text-xs font-semibold text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Steps */}
        {repair.safety !== "avoid" && repair.steps.length > 0 && (
          <div className="rise mb-5" style={{ animationDelay: "120ms" }}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Steps
              </h3>
              {checkedCount > 0 && (
                <span className="text-xs font-semibold text-primary">
                  {checkedCount}/{repair.steps.length} done
                </span>
              )}
            </div>

            {/* Progress bar for steps */}
            {repair.steps.length > 0 && (
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-glass-strong">
                <div
                  className="h-full rounded-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${(checkedCount / repair.steps.length) * 100}%` }}
                />
              </div>
            )}

            <div className="space-y-3">
              {repair.steps.map((step, i) => {
                const done = !!checked[i];
                return (
                  <button
                    key={i}
                    onClick={() => setChecked((p) => ({ ...p, [i]: !p[i] }))}
                    className={cn(
                      "pressable w-full rounded-3xl p-4 text-left transition-all",
                      done
                        ? "border border-success/30 bg-success/10"
                        : "glass",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-0.5 shrink-0", done ? "text-success" : "text-muted-foreground")}>
                        {done ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          <Circle className="size-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[11px] font-bold",
                              done ? "text-success" : "text-primary",
                            )}
                          >
                            Step {i + 1}
                          </span>
                          <p
                            className={cn(
                              "font-semibold",
                              done
                                ? "text-muted-foreground line-through"
                                : "text-foreground",
                            )}
                          >
                            {step.title}
                          </p>
                        </div>
                        {!done && (
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {step.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {allDone && (
              <div className="rise mt-4 rounded-3xl border border-success/30 bg-success/10 p-4 text-center">
                <p className="text-lg font-bold text-success">🎉 All steps done!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mark this repair as fixed below.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status update */}
        <div className="rise mb-4" style={{ animationDelay: "140ms" }}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Update status
          </h3>
          <div className="flex gap-2">
            {statusOptions.map((s) => {
              const SIcon = s.icon;
              const active = repair.status === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    updateStatus(id, s.id);
                    toast.success(`Marked as ${s.label}`);
                  }}
                  className={cn(
                    "pressable flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-3 text-center text-xs font-semibold transition-all",
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-glow-sm"
                      : "glass text-muted-foreground",
                  )}
                >
                  <SIcon className="size-4" />
                  <span className="leading-tight">{s.id === "fixed" ? "Fixed" : s.id === "in-progress" ? "In Progress" : "Needs Pro"}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Impact */}
        {repair.moneySaved > 0 && (
          <div className="rise mb-4 grid grid-cols-2 gap-3" style={{ animationDelay: "160ms" }}>
            <GlassCard className="text-center">
              <div className="flex justify-center">
                <DollarSign className="size-5 text-success" />
              </div>
              <p className="mt-1 text-xl font-bold text-success">${repair.moneySaved}</p>
              <p className="text-xs text-muted-foreground">Money saved</p>
            </GlassCard>
            <GlassCard className="text-center">
              <div className="flex justify-center">
                <Leaf className="size-5 text-accent" />
              </div>
              <p className="mt-1 text-xl font-bold text-accent">{repair.wasteSavedKg}kg</p>
              <p className="text-xs text-muted-foreground">Waste avoided</p>
            </GlassCard>
          </div>
        )}

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="rise flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="size-4" />
          Delete this repair
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
