import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ChevronDown } from "lucide-react";
import { BottomNav } from "@/components/app/BottomNav";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { safetyTips, faqs } from "@/lib/repair-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/safety")({ component: SafetyPage });

const HARD_BLOCKS = [
  { emoji: "🔥", title: "Smoke or burning smell", body: "Stop immediately. Unplug and move the device away from flammables. Do not open it." },
  { emoji: "🔋", title: "Swollen or hot battery", body: "A puffed lithium battery is a fire hazard. Do not press, puncture, or charge it. Take it to a drop-off point." },
  { emoji: "⚡", title: "Sparks or electric shock", body: "Do not touch the device. Disconnect power at the circuit breaker if needed. Call a certified electrician." },
  { emoji: "🌊", title: "Mains wiring or live circuits", body: "Always isolate at the breaker, not just the switch. Internal mains repairs need a qualified electrician." },
  { emoji: "🧲", title: "Microwave capacitors", body: "Microwave capacitors store lethal charge even when unplugged. Never open a microwave unless you're trained." },
  { emoji: "⛽", title: "Gas appliances", body: "Any smell of gas: ventilate, do not switch on lights, leave, and call the gas emergency line." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard interactive className="p-0 overflow-hidden">
      <button
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <p className="font-semibold text-foreground">{q}</p>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      )}
    </GlassCard>
  );
}

function SafetyPage() {
  return (
    <div className="bg-app min-h-dvh">
      <div className="relative mx-auto max-w-md px-4 pb-32 pt-4">
        <PageHeader
          title="Safety First"
          description="Know when to DIY and when to call a pro."
          eyebrow="Guidelines"
        />

        {/* Never DIY */}
        <section className="rise mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Stop — call a professional
          </h2>
          <div className="space-y-2.5">
            {HARD_BLOCKS.map((b) => (
              <div
                key={b.title}
                className="glass flex items-start gap-4 rounded-3xl border-destructive/25 p-4"
              >
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <p className="font-semibold text-foreground">{b.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* General tips */}
        <section className="rise mb-6" style={{ animationDelay: "80ms" }}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Before Every Repair
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {safetyTips.map((t) => (
              <GlassCard key={t.title} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary">
                  <ShieldCheck className="size-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t.body}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="rise" style={{ animationDelay: "120ms" }}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            FAQ
          </h2>
          <div className="space-y-2">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
