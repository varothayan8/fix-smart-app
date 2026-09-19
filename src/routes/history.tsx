import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench, Trash2 } from "lucide-react";
import { BottomNav } from "@/components/app/BottomNav";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { RepairCard } from "@/components/app/RepairCard";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import type { RepairStatus } from "@/lib/repair-data";

export const Route = createFileRoute("/history")({ component: HistoryPage });

const tabs: { id: RepairStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In Progress" },
  { id: "fixed", label: "Fixed" },
  { id: "needs-pro", label: "Needs Pro" },
];

function HistoryPage() {
  const { history, removeRepair } = useApp();
  const [activeTab, setActiveTab] = useState<RepairStatus | "all">("all");

  const filtered =
    activeTab === "all" ? history : history.filter((r) => r.status === activeTab);

  return (
    <div className="bg-app min-h-dvh">
      <div className="relative mx-auto max-w-md px-4 pb-32 pt-4">
        <PageHeader
          title="Repair History"
          description="Your saved repairs and diagnoses"
          eyebrow="Library"
        />

        {/* Tabs */}
        <div className="glass mb-5 flex gap-1 rounded-2xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-gradient-primary text-primary-foreground shadow-glow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No repairs yet"
            body={
              activeTab === "all"
                ? "Start your first repair to see it here."
                : `No repairs with status "${activeTab}".`
            }
            action={
              activeTab === "all" ? (
                <Link to="/repair">
                  <Button variant="hero" size="lg">
                    Start a Repair
                  </Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="group relative">
                <RepairCard repair={r} />
                <button
                  onClick={() => removeRepair(r.id)}
                  aria-label="Delete repair"
                  className="glass-strong absolute right-3 top-3 hidden h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-destructive group-hover:flex"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
