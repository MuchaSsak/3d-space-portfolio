import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

export function getPrefersReducedMotion() {
  return window.matchMedia(query).matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getPrefersReducedMotion, () => false);
}

export default usePrefersReducedMotion;
