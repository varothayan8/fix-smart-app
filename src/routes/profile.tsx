import { createFileRoute } from "@tanstack/react-router";
import {
  Sun,
  Moon,
  Download,
  Star,
  Leaf,
  DollarSign,
  Wrench,
  ChevronRight,
  CreditCard,
  Info,
} from "lucide-react";
import { BottomNav } from "@/components/app/BottomNav";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { InstallButton, InstallSheet } from "@/components/app/Install";
import { Logo } from "@/components/app/Logo";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function Row({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof Sun;
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors ${onClick ? "hover:bg-glass-strong" : "cursor-default"}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary">
        <Icon className="size-4 text-primary-foreground" />
      </div>
      <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
      {value && <span className="text-sm text-muted-foreground">{value}</span>}
      {onClick && <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
    </button>
  );
}

function ProfilePage() {
  const { history, theme, toggleTheme } = useApp();

  const totalWaste = history.reduce((s, r) => s + r.wasteSavedKg, 0);
  const totalMoney = history.reduce((s, r) => s + r.moneySaved, 0);
  const fixedCount = history.filter((r) => r.status === "fixed").length;

  return (
    <div className="bg-app min-h-dvh">
      <div className="relative mx-auto max-w-md px-4 pb-32 pt-4">
        <PageHeader title="Profile" eyebrow="You" />

        {/* Avatar + name */}
        <div className="rise mb-6 flex flex-col items-center gap-3">
          <div className="bg-gradient-primary flex h-20 w-20 items-center justify-center rounded-3xl text-3xl font-bold text-primary-foreground shadow-glow">
            R
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">ReVive User</p>
            <p className="text-sm text-muted-foreground">Demo account</p>
          </div>
        </div>

        {/* Stats */}
        <div className="rise mb-6 grid grid-cols-3 gap-3">
          {[
            { icon: Wrench, value: String(history.length), label: "Repairs" },
            { icon: DollarSign, value: `$${totalMoney}`, label: "Saved" },
            { icon: Leaf, value: `${totalWaste.toFixed(1)}kg`, label: "CO₂" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <GlassCard key={s.label} className="flex flex-col items-center gap-1.5 py-4">
                <Icon className="size-5 text-primary" />
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Settings */}
        <GlassCard className="rise mb-4 space-y-1 p-2">
          <Row
            icon={theme === "dark" ? Moon : Sun}
            label={theme === "dark" ? "Dark mode" : "Light mode"}
            value="Toggle"
            onClick={toggleTheme}
          />
          <div className="px-2">
            <div className="h-px bg-border" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary">
              <Download className="size-4 text-primary-foreground" />
            </div>
            <span className="flex-1 text-sm font-semibold text-foreground">Install App</span>
            <InstallButton variant="glass" size="sm" label="Add" />
          </div>
        </GlassCard>

        {/* Stripe / Pro — placeholder */}
        <GlassCard className="rise mb-4 overflow-hidden p-0">
          <div className="bg-gradient-to-br from-primary/20 to-accent/10 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow-sm">
                <Star className="size-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">ReVive Pro</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Unlimited repairs, photo AI, priority support
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="glass flex-1 rounded-2xl px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground">Monthly</p>
                <p className="text-lg font-bold text-foreground">$4.99</p>
              </div>
              <div className="glass-strong flex-1 rounded-2xl px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground">Yearly</p>
                <p className="text-lg font-bold text-foreground">$39.99</p>
              </div>
            </div>
            {/* Stripe integration point */}
            <button
              onClick={() => alert("Stripe integration coming soon.\n\nIntegration point: connect a Stripe Checkout session via /api/create-checkout-session (server function) with test key sk_test_***. Never expose secret keys client-side.")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow-sm transition-opacity hover:opacity-90"
            >
              <CreditCard className="size-4" />
              Upgrade — Test Mode Only
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              ⚠️ Stripe test credentials required. Core safety features always free.
            </p>
          </div>
        </GlassCard>

        {/* About */}
        <GlassCard className="rise flex items-start gap-3 rounded-2xl p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <Logo size={20} className="mb-2" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              ReVive is an AI-powered DIY repair assistant. Safety screening uses deterministic
              rules — not AI. AI guidance (demo mode) uses pre-written repair blueprints; production
              would call Claude via a server function. No API keys are exposed in client code.
            </p>
          </div>
        </GlassCard>
      </div>

      <BottomNav />
      <InstallSheet />
    </div>
  );
}
