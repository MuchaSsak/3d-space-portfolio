import { useSyncExternalStore } from "react";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);
      return () => mediaQueryList.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

// Phones and other small screens, where long content can't be anchored in the 3D scene and needs its own scrollable panel
export const compactScreenQuery = "(max-height: 640px), (max-width: 767px)";

export function useIsCompactScreen() {
  return useMediaQuery(compactScreenQuery);
}

export default useMediaQuery;
