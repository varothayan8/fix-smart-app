import { Download, Zap, Smartphone, RefreshCw, Share, SquarePlus, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useApp } from "@/lib/app-store";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

const benefits = [
  { icon: Zap, title: "Quick access", body: "One tap from your home screen." },
  { icon: Smartphone, title: "App-like feel", body: "Full screen, no browser bars." },
  { icon: RefreshCw, title: "Faster reopen", body: "Picks up right where you left off." },
];

/** Button that triggers the native prompt or opens the helper sheet. */
export function InstallButton({
  className,
  variant = "glass",
  size = "default",
  label = "Install App",
}: {
  className?: string;
  variant?: "glass" | "hero" | "outline" | "ghost";
  size?: "default" | "lg" | "xl" | "sm";
  label?: string;
}) {
  const { isStandalone, setInstallOpen } = useApp();
  if (isStandalone) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Check /> Installed
      </Button>
    );
  }
  return (
    <Button variant={variant} size={size} className={className} onClick={() => setInstallOpen(true)}>
      <Download /> {label}
    </Button>
  );
}

/** Bottom sheet with benefits + native prompt / iOS instructions. */
export function InstallSheet() {
  const { installOpen, setInstallOpen, canPrompt, isIOS, promptInstall, isStandalone } = useApp();

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === "accepted") {
      toast.success("ReVive is on your home screen ✨");
      setInstallOpen(false);
    } else if (outcome === "dismissed") {
      toast("No worries — you can install anytime from Profile.");
    }
  };

  return (
    <Drawer open={installOpen} onOpenChange={setInstallOpen}>
      <DrawerContent className="glass-strong mx-auto max-w-md rounded-t-[2rem] border-border-strong bg-popover/90 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <DrawerHeader className="text-left">
          <div className="mb-3 flex items-center gap-3">
            <img
              src="/icons/icon-192.png"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-2xl shadow-glow"
            />
            <div>
              <DrawerTitle className="font-display text-xl">Install ReVive</DrawerTitle>
              <DrawerDescription>Fix smarter, straight from your home screen.</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="space-y-2.5 px-4">
          {benefits.map(({ icon: Icon, title, body }) => (
            <div key={title} className="glass flex items-center gap-3 rounded-2xl p-3">
              <div className="bg-gradient-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                <Icon className="size-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pt-5">
          {isStandalone ? (
            <p className="text-center text-sm text-muted-foreground">You're already using the installed app. Nice.</p>
          ) : canPrompt ? (
            <Button variant="hero" size="xl" className="w-full" onClick={handleInstall}>
              <Download /> Add to Home Screen
            </Button>
          ) : (
            <IOSHelper ios={isIOS} />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function IOSHelper({ ios }: { ios: boolean }) {
  return (
    <GlassCard className="rounded-2xl p-4">
      <p className="text-sm font-semibold text-foreground">
        {ios ? "Add to Home Screen on iPhone" : "Add to Home Screen"}
      </p>
      <ol className="mt-3 space-y-2.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-3">
          <span className="glass-strong flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-accent">
            <Share className="size-4" />
          </span>
          <span>
            Tap the <strong className="text-foreground">Share</strong> button in {ios ? "Safari" : "your browser"}
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="glass-strong flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-accent">
            <SquarePlus className="size-4" />
          </span>
          <span>
            Choose <strong className="text-foreground">Add to Home Screen</strong>
          </span>
        </li>
        <li className="flex items-center gap-3">
          <span className="glass-strong flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-accent">
            <Check className="size-4" />
          </span>
          <span>
            Tap <strong className="text-foreground">Add</strong> — done!
          </span>
        </li>
      </ol>
    </GlassCard>
  );
}

/** Dismissible glass card promoting installation (Home + Profile). */
export function InstallCard({ className, dismissible = true }: { className?: string; dismissible?: boolean }) {
  const { isStandalone, installDismissed, dismissInstall, setInstallOpen, hydrated } = useApp();
  if (!hydrated || isStandalone || (dismissible && installDismissed)) return null;

  return (
    <div
      className={cn(
        "rise relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-glass to-accent/15 p-5 backdrop-blur-xl",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/25 blur-3xl" />
      {dismissible && (
        <button
          onClick={dismissInstall}
          aria-label="Dismiss"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-glass-strong hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
      <div className="flex items-start gap-4">
        <img src="/icons/icon-192.png" alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-2xl shadow-glow-sm" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-foreground">Install ReVive</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Quick access, app-like experience, faster reopen.
          </p>
          <Button variant="hero" size="sm" className="mt-3.5" onClick={() => setInstallOpen(true)}>
            <Download /> Add to Home Screen
          </Button>
        </div>
      </div>
    </div>
  );
}
