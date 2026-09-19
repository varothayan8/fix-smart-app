import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { demoHistory, type RepairResult, type RepairStatus } from "./repair-data";

/*
 * Lightweight client store for the ReVive MVP.
 * History persists in localStorage so it survives reloads; swap the
 * persistence layer for Lovable Cloud when a backend is added.
 */

type Theme = "dark" | "light";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface AppState {
  hydrated: boolean;
  history: RepairResult[];
  current: RepairResult | null;
  setCurrent: (r: RepairResult | null) => void;
  saveRepair: (r: RepairResult) => boolean;
  updateStatus: (id: string, status: RepairStatus) => void;
  removeRepair: (id: string) => void;
  theme: Theme;
  toggleTheme: () => void;
  /* PWA install */
  canPrompt: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  installDismissed: boolean;
  dismissInstall: () => void;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
  installOpen: boolean;
  setInstallOpen: (open: boolean) => void;
}

const HISTORY_KEY = "revive.history.v1";
const THEME_KEY = "revive.theme";
const DISMISS_KEY = "revive.install.dismissed";

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [history, setHistory] = useState<RepairResult[]>(demoHistory);
  const [current, setCurrent] = useState<RepairResult | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);

  // Hydrate from browser storage after mount to avoid SSR mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
      const t = localStorage.getItem(THEME_KEY) as Theme | null;
      if (t) setTheme(t);
      setInstallDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      /* ignore */
    }
    const ua = navigator.userAgent;
    setIsIOS(/iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua) ? true : /iphone|ipad|ipod/i.test(ua));
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    setHydrated(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setIsStandalone(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", theme === "light" ? "#eef5f4" : "#0f1a26");
  }, [theme]);

  const persist = useCallback((next: RepairResult[]) => {
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const saveRepair = useCallback(
    (r: RepairResult) => {
      if (history.some((h) => h.id === r.id)) return false;
      persist([r, ...history]);
      return true;
    },
    [history, persist],
  );

  const updateStatus = useCallback(
    (id: string, status: RepairStatus) =>
      persist(history.map((h) => (h.id === id ? { ...h, status } : h))),
    [history, persist],
  );

  const removeRepair = useCallback(
    (id: string) => persist(history.filter((h) => h.id !== id)),
    [history, persist],
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const dismissInstall = useCallback(() => {
    setInstallDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return "unavailable" as const;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setDeferred(null);
    return outcome;
  }, [deferred]);

  const value = useMemo<AppState>(
    () => ({
      hydrated,
      history,
      current,
      setCurrent,
      saveRepair,
      updateStatus,
      removeRepair,
      theme,
      toggleTheme,
      canPrompt: !!deferred,
      isStandalone,
      isIOS,
      installDismissed,
      dismissInstall,
      promptInstall,
      installOpen,
      setInstallOpen,
    }),
    [
      hydrated,
      history,
      current,
      saveRepair,
      updateStatus,
      removeRepair,
      theme,
      toggleTheme,
      deferred,
      isStandalone,
      isIOS,
      installDismissed,
      dismissInstall,
      promptInstall,
      installOpen,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
