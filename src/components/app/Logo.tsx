import { cn } from "@/lib/utils";

export function Logo({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src="/icons/icon-192.png"
        alt="ReVive"
        width={size}
        height={size}
        className="rounded-xl shadow-glow-sm"
        style={{ width: size, height: size }}
      />
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        Re<span className="text-gradient-primary">Vive</span>
      </span>
    </div>
  );
}
