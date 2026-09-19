import { Link } from "@tanstack/react-router";
import { Home, Wrench, History, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/repair", label: "Repair", icon: Wrench },
  { to: "/history", label: "History", icon: History },
  { to: "/safety", label: "Safety", icon: ShieldCheck },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-3"
    >
      <div className="glass-strong pointer-events-auto flex w-full max-w-md items-center justify-between rounded-[1.75rem] p-1.5">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold text-muted-foreground transition-colors"
            activeProps={{ className: "text-primary-foreground", "data-active": "true" }}
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "pressable relative flex h-9 w-12 items-center justify-center rounded-2xl transition-all",
                    isActive && "bg-gradient-primary shadow-glow-sm",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-[19px] transition-transform group-active:scale-90",
                      isActive ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                </span>
                <span className={cn(isActive ? "text-foreground" : "text-muted-foreground")}>
                  {label}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
