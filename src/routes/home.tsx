import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, ArrowRight, Leaf, DollarSign, TrendingUp } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { BottomNav } from "@/components/app/BottomNav";
import { Logo } from "@/components/app/Logo";
import { RepairCard } from "@/components/app/RepairCard";
import { InstallCard, InstallSheet } from "@/components/app/Install";
import { SafetyBadge } from "@/components/app/SafetyBadge";
import { categoryMap, suggestedRepairs } from "@/lib/repair-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function StatPill({ icon: Icon, value, label, tone }: { icon: typeof Leaf; value: string; label: string; tone: string }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-3.5">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary`}>
        <Icon className="size-4 text-primary-foreground" />
      </div>
      <div>
        <p className={`text-base font-bold ${tone}`}>{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function HomePage() {
  const { history } = useApp();
  const recent = history.slice(0, 2);
  const totalWaste = history.reduce((s, r) => s + r.wasteSavedKg, 0);
  const totalMoney = history.reduce((s, r) => s + r.moneySaved, 0);
  const fixedCount = history.filter((r) => r.status === "fixed").length;

  return (
    <div className="bg-app min-h-dvh">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl animate-float" />
        <div className="absolute -right-20 top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-float-slow" />
      </div>

      <div className="relative mx-auto max-w-md px-4 pb-32 pt-4">
        {/* Top bar */}
        <header className="safe-top mb-6 flex items-center justify-between">
          <Logo />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile" aria-label="Profile">
              <div className="glass-strong flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-primary">
                R
              </div>
            </Link>
          </Button>
        </header>

        {/* Hero */}
        <div className="rise mb-6">
          <div className="glass-strong overflow-hidden rounded-3xl p-6">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">AI Repair Assistant</p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-foreground">
              Fix smarter.<br />
              <span className="text-gradient">Waste less.</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Diagnose everyday appliances in seconds with step-by-step AI guidance.
            </p>
            <Link to="/repair">
              <Button variant="hero" size="lg" className="mt-5 w-full gap-2">
                <Wrench className="size-4" />
                Start a Repair
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="rise mb-6 grid grid-cols-3 gap-2.5" style={{ animationDelay: "60ms" }}>
          <StatPill icon={DollarSign} value={`$${totalMoney}`} label="Saved" tone="text-success" />
          <StatPill icon={Leaf} value={`${totalWaste.toFixed(1)}kg`} label="CO₂ saved" tone="text-accent" />
          <StatPill icon={TrendingUp} value={`${fixedCount}`} label="Fixed" tone="text-primary" />
        </div>

        {/* Install card */}
        <InstallCard className="mb-6" />

        {/* Quick start */}
        <section className="rise mb-6" style={{ animationDelay: "120ms" }}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {suggestedRepairs.map((s) => {
              const cat = categoryMap[s.category];
              const Icon = cat.icon;
              return (
                <Link
                  key={s.category}
                  to="/repair"
                  search={{ category: s.category }}
                  className="glass pressable hover-lift flex items-center gap-4 rounded-2xl p-4"
                >
                  <div className="glass-strong flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.time}</p>
                  </div>
                  <SafetyBadge level={s.safety} />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent repairs */}
        {recent.length > 0 && (
          <section className="rise" style={{ animationDelay: "180ms" }}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Recent Repairs
              </h2>
              <Link to="/history" className="text-xs font-semibold text-primary">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {recent.map((r) => (
                <RepairCard key={r.id} repair={r} compact />
              ))}
            </div>
          </section>
        )}
      </div>

      <BottomNav />
      <InstallSheet />
    </div>
  );
}
