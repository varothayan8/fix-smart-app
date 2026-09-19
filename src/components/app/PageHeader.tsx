import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  backTo?: "/home" | "/history" | "/repair";
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, eyebrow, description, backTo, action, className }: PageHeaderProps) {
  return (
    <header className={cn("rise mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3", className)}>
      <div className="min-w-0">
        {backTo && (
          <Link
            to={backTo}
            className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl glass pressable text-foreground"
            aria-label="Back"
          >
            <ChevronLeft className="size-5" />
          </Link>
        )}
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </header>
  );
}
