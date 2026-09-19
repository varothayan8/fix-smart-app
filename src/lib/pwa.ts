/*
 * PWA structure notes for ReVive
 * --------------------------------
 * Installability today is manifest-driven:
 *   - public/manifest.webmanifest (name, icons, standalone display, start_url)
 *   - <link rel="manifest"> + apple-touch-icon + theme-color in src/routes/__root.tsx
 *   - Install prompt handling (beforeinstallprompt / appinstalled) lives in src/lib/app-store.tsx
 *
 * Offline support / service worker:
 *   Intentionally NOT registered yet. A service worker caches HTML and can
 *   serve stale builds in preview environments. When offline mode is wanted,
 *   add `vite-plugin-pwa` (generateSW, NetworkFirst for navigations) and
 *   register it only from a guarded wrapper that refuses to run in dev,
 *   iframes and *.lovableproject.com previews.
 */

export const PWA_SUPPORTS_OFFLINE = false;

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}
