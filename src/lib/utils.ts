import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debouncer functions add a delay between an event and a reaction, so scaling and scrolling doesn't evoke a function dozens of times
export function debouncer<Params extends any[]>(
  func: (...args: Params) => any,
  timeout = 1000
) {
  let timeoutId: NodeJS.Timeout;

  return (...args: Params) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

// Opts a 3D object out of raycasting (pointer events and the lens flare occlusion test, which raycasts the whole scene every frame)
export function skipRaycast() {}
