import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useState,
  useRef,
  type ChangeEvent,
} from "react";
import {
  ArrowRight,
  ShieldAlert,
  Camera,
  X,
  CheckCircle2,
  Wrench,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "@/components/app/BottomNav";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/app/GlassCard";
import { SafetyBadge, SafetyPanel } from "@/components/app/SafetyBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  analyzeRepair,
  categories,
  type CategoryId,
  type RepairResult,
} from "@/lib/repair-data";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import { z } from "zod";

export const Route = createFileRoute("/repair")({
  validateSearch: z.object({ category: z.string().optional() }),
  component: RepairPage,
});

// ─── Deterministic safety gate ─────────────────────────────────────────────
// IMPORTANT: runs client-side BEFORE any AI call. Certain keywords are
// absolute blocks — no AI result can override this list.
const HARD_BLOCK_PATTERNS = [
  /smoke/i,
  /burn(ing|t)/i,
  /spark/i,
  /swell(en|ing)?|swollen|puff(ed|y)/i,
  /fire/i,
  /electric\s*shock|shock(ed)?/i,
  /melt(ing|ed)?/i,
  /smell.*(gas|burnt|burning)/i,
  /gas\s*leak/i,
  /mains\s*wire|mains\s*wiring|live\s*wire/i,
  /microwave\s*capacitor/i,
];

const CAUTION_PATTERNS = [
  /battery/i,
  /lithium/i,
  /wiring/i,
  /capacitor/i,
  /heating\s*element/i,
];

type SafetyDecision =
  | { ok: true }
  | { ok: false; blocked: true; reason: string }
  | { ok: false; blocked: false; caution: string };

function runSafetyGate(description: string, category: CategoryId): SafetyDecision {
  const text = description.trim();
  if (!text) return { ok: false, blocked: true, reason: "Please describe the issue first." };

  for (const p of HARD_BLOCK_PATTERNS) {
    if (p.test(text)) {
      return {
        ok: false,
        blocked: true,
        reason:
          "Your description mentions a potentially dangerous situation (smoke, sparks, burns, swollen battery, or gas). For your safety, we can't provide DIY guidance here. Please unplug the device, keep clear of it, and contact a certified repair technician.",
      };
    }
  }

  if (category === "other") {
    return {
      ok: false,
      blocked: true,
      reason:
        "Unknown device type — we can't verify safe DIY access without knowing the appliance. Please select a specific category or consult a professional.",
    };
  }

  for (const p of CAUTION_PATTERNS) {
    if (p.test(text)) {
      return {
        ok: false,
        blocked: false,
        caution:
          "Your description mentions sensitive components (batteries, wiring, or capacitors). Proceed only if you're comfortable and follow all safety steps exactly.",
      };
    }
  }

  return { ok: true };
}

// ─── Steps ──────────────────────────────────────────────────────────────────

type Step = "category" | "describe" | "safety" | "result";

const STEPS: Step[] = ["category", "describe", "safety", "result"];
const STEP_LABELS = ["Device", "Issue", "Safety", "Guidance"];

function stepIndex(s: Step) {
  return STEPS.indexOf(s);
}

// ─── Component ──────────────────────────────────────────────────────────────

function RepairPage() {
  const { category: initialCategory } = Route.useSearch();
  const navigate = useNavigate();
  const { saveRepair, setCurrent } = useApp();

  const [step, setStep] = useState<Step>(initialCategory ? "describe" : "category");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(
    (initialCategory as CategoryId) ?? null,
  );
  const [description, setDescription] = useState("");
  const [imageName, setImageName] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [safetyDecision, setSafetyDecision] = useState<SafetyDecision | null>(null);
  const [result, setResult] = useState<RepairResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const progress = ((stepIndex(step) + 1) / STEPS.length) * 100;

  // Photo upload
  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Photo must be under 10 MB");
      return;
    }
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Step: Category → Describe
  const handleCategorySelect = (id: CategoryId) => {
    setSelectedCategory(id);
    setStep("describe");
  };

  // Step: Describe → Safety check
  const handleDescribeNext = () => {
    if (!selectedCategory || !description.trim()) return;
    const decision = runSafetyGate(description, selectedCategory);
    setSafetyDecision(decision);
    setStep("safety");
  };

  // Step: Safety → Analysis
  const handleProceed = async () => {
    if (!selectedCategory) return;
    setAnalyzing(true);
    setStep("result");

    // Simulate async AI call (mock — no API key required)
    await new Promise((r) => setTimeout(r, 1600));

    const res = analyzeRepair({
      category: selectedCategory,
      description,
      ...(imageName ? { imageName } : {}),
    });

    setResult(res);
    setCurrent(res);
    saveRepair(res);
    setAnalyzing(false);
  };

  return (
    <div className="bg-app min-h-dvh">
      <div className="relative mx-auto max-w-md px-4 pb-32 pt-4">
        <PageHeader
          title="New Repair"
          eyebrow={`Step ${stepIndex(step) + 1} of ${STEPS.length}`}
          {...(step === "category" ? { backTo: "/home" as const } : {})}
          action={
            step !== "category" && step !== "result" ? (
              <button
                className="text-sm font-semibold text-muted-foreground"
                onClick={() => {
                  const prev = STEPS[stepIndex(step) - 1];
                  if (prev) setStep(prev);
                }}
              >
                ← Back
              </button>
            ) : undefined
          }
        />

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-2 flex gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all",
                  i <= stepIndex(step) ? "bg-gradient-primary" : "bg-glass-strong",
                )}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {STEP_LABELS.map((l, i) => (
              <span
                key={l}
                className={cn(
                  "text-[10px] font-semibold",
                  i <= stepIndex(step) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* ── Step 1: Category ── */}
        {step === "category" && (
          <div className="rise space-y-3">
            <p className="text-sm text-muted-foreground">What are you trying to fix?</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="glass pressable hover-lift flex flex-col items-start gap-3 rounded-3xl p-4 text-left transition-all"
                  >
                    <div className="glass-strong flex h-11 w-11 items-center justify-center rounded-2xl text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{cat.label}</p>
                      <p className="text-xs text-muted-foreground">{cat.hint}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 2: Describe ── */}
        {step === "describe" && selectedCategory && (
          <div className="rise space-y-4">
            {/* Selected device chip */}
            <div className="glass inline-flex items-center gap-2 rounded-2xl px-3 py-2">
              {(() => {
                const cat = categories.find((c) => c.id === selectedCategory)!;
                const Icon = cat.icon;
                return (
                  <>
                    <Icon className="size-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                    <button
                      onClick={() => setStep("category")}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      aria-label="Change device"
                    >
                      <X className="size-3.5" />
                    </button>
                  </>
                );
              })()}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Describe the problem
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. The kettle takes ages to boil and clicks off early. No smoke or smell."
                className="glass min-h-[120px] rounded-2xl border-border text-foreground placeholder:text-muted-foreground"
                maxLength={500}
              />
              <p className="mt-1.5 text-right text-[11px] text-muted-foreground">
                {description.length}/500
              </p>
            </div>

            {/* Optional photo */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Photo{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setImageName(undefined);
                    }}
                    className="glass-strong absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-foreground"
                    aria-label="Remove photo"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="glass pressable flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border-strong py-6 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                >
                  <Camera className="size-5" />
                  <span className="text-sm font-semibold">Add a photo</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhoto}
              />
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full gap-2"
              disabled={!description.trim()}
              onClick={handleDescribeNext}
            >
              Continue <ArrowRight className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Step 3: Safety screening ── */}
        {step === "safety" && safetyDecision && (
          <div className="rise space-y-4">
            {!safetyDecision.ok && safetyDecision.blocked ? (
              // HARD BLOCK
              <GlassCard className="space-y-4 border-destructive/40 bg-gradient-to-br from-destructive/20 to-destructive/5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/20 text-destructive">
                    <ShieldAlert className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-destructive">
                      Safety Block
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-foreground">DIY Not Safe Here</h2>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {safetyDecision.reason}
                </p>
                <div className="glass rounded-2xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground">What to do</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                    <li>• Unplug the device immediately</li>
                    <li>• Keep it away from flammable materials</li>
                    <li>• Contact a certified repair technician</li>
                    <li>• If there's a fire or injury risk, call emergency services</li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setDescription("");
                    setImageName(undefined);
                    setImagePreview(null);
                    setStep("category");
                    setSafetyDecision(null);
                  }}
                >
                  Start a Different Repair
                </Button>
              </GlassCard>
            ) : !safetyDecision.ok && !safetyDecision.blocked ? (
              // CAUTION — user must confirm
              <div className="space-y-4">
                <GlassCard className="space-y-3 border-warning/40 bg-gradient-to-br from-warning/20 to-warning/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warning/20 text-warning">
                      <AlertTriangle className="size-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-warning">
                        Caution Required
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-foreground">Proceed Carefully</h2>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {safetyDecision.caution}
                  </p>
                </GlassCard>

                <div className="glass rounded-2xl p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Before continuing, confirm:</p>
                  <ul className="mt-2 space-y-1">
                    <li>✓ The device is unplugged</li>
                    <li>✓ I have the right tools</li>
                    <li>✓ I'll stop immediately if anything looks wrong</li>
                  </ul>
                </div>

                <Button variant="hero" size="lg" className="w-full gap-2" onClick={handleProceed}>
                  <CheckCircle2 className="size-4" />
                  I Understand — Show Guidance
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setStep("describe")}
                >
                  Go Back
                </Button>
              </div>
            ) : (
              // ALL CLEAR
              <div className="space-y-4">
                <GlassCard className="space-y-3 border-success/40 bg-gradient-to-br from-success/20 to-success/5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/20 text-success">
                      <CheckCircle2 className="size-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-success">
                        Safety Check Passed
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-foreground">
                        Safe to Proceed
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90">
                    No high-risk keywords detected. Follow each step carefully and unplug before
                    you start.
                  </p>
                </GlassCard>

                <Button variant="hero" size="lg" className="w-full gap-2" onClick={handleProceed}>
                  <Wrench className="size-4" />
                  Get Repair Guidance
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Result (AI mock) ── */}
        {step === "result" && (
          <div className="rise space-y-4">
            {analyzing ? (
              <GlassCard className="flex flex-col items-center gap-4 py-10">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
                  <div className="bg-gradient-primary relative flex h-16 w-16 items-center justify-center rounded-3xl shadow-glow">
                    <Loader2 className="size-7 animate-spin text-primary-foreground" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">Analyzing your repair…</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Running safety checks and building your guide
                  </p>
                </div>
                {/* Mock AI status */}
                <div className="glass w-full rounded-2xl p-3 text-center">
                  <p className="text-xs font-mono text-muted-foreground">
                    ⚡ AI Demo Mode — no API key required
                  </p>
                </div>
              </GlassCard>
            ) : result ? (
              <>
                {/* Safety panel */}
                <SafetyPanel level={result.safety} note={result.safetyNote} />

                {/* If avoid, no more DIY steps */}
                {result.safety === "avoid" ? (
                  <GlassCard className="space-y-3">
                    <h2 className="text-lg font-bold text-foreground">Professional Help Needed</h2>
                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                    <div className="space-y-2">
                      {result.steps.map((s, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-xs font-bold text-destructive">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{s.title}</p>
                            <p className="text-xs text-muted-foreground">{s.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                ) : (
                  <>
                    {/* Summary */}
                    <GlassCard className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div>
                          <div className="mb-1 flex flex-wrap gap-2">
                            <SafetyBadge level={result.safety} />
                            <span className="glass inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                              {result.difficulty} · {result.timeEstimate}
                            </span>
                          </div>
                          <h2 className="text-lg font-bold text-foreground">{result.issue}</h2>
                          <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Tools */}
                    <GlassCard>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                        You'll need
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.tools.map((t) => (
                          <span
                            key={t}
                            className="glass-strong rounded-full px-3 py-1 text-xs font-semibold text-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </GlassCard>

                    {/* View full guide */}
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full gap-2"
                      onClick={() => navigate({ to: "/history/$id", params: { id: result.id } })}
                    >
                      <Wrench className="size-4" />
                      View Step-by-Step Guide
                    </Button>

                    {/* Impact */}
                    <div className="grid grid-cols-2 gap-3">
                      <GlassCard className="text-center">
                        <p className="text-2xl font-bold text-success">${result.moneySaved}</p>
                        <p className="text-xs text-muted-foreground">Est. money saved</p>
                      </GlassCard>
                      <GlassCard className="text-center">
                        <p className="text-2xl font-bold text-accent">{result.wasteSavedKg}kg</p>
                        <p className="text-xs text-muted-foreground">Landfill avoided</p>
                      </GlassCard>
                    </div>
                  </>
                )}

                {/* AI disclosure */}
                <GlassCard className="flex items-start gap-3 rounded-2xl p-3.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="text-[10px] font-bold">AI</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Demo mode:</strong> Guidance is
                    pre-written for common repairs. In production, Claude AI generates personalised
                    step-by-step instructions from your description and photo. Safety screening
                    always runs deterministically — not via AI.
                  </p>
                </GlassCard>
              </>
            ) : null}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
