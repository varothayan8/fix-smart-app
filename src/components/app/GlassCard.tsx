import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  interactive?: boolean;
}

export function GlassCard({ className, strong, interactive, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl p-5",
        strong ? "glass-strong" : "glass",
        interactive && "pressable hover-lift cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}
