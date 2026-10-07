import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSettingsContext } from "@/contexts/SettingsContext";
import { MAX_SCROLL_PROGRESS, MIN_SCROLL_PROGRESS } from "@/lib/sections";

/**
 * Options
 */
// Wheel events separated by more than this are treated as a new gesture (trackpads keep firing inertia events)
const wheelGestureGapMs = 180;
// Minimum accumulated wheel delta of one gesture before it moves the experience
const wheelGestureThreshold = 30;
// Minimum swipe distance on touch devices
const swipeThreshold = 40;
const swipeMaxDurationMs = 1200;

/**
 * Types
 */
export type ScrollDirection = 1 | -1;
export type ScrollAxis = "vertical" | "horizontal";
export type ScrollInputSource = "wheel" | "keyboard" | "touch" | "button";

// Sections with their own inner navigation (e.g. the projects carousel) can consume the input before it moves the camera. Returning true means the input was consumed
export type ScrollInterceptor = (
  direction: ScrollDirection,
  options: { source: ScrollInputSource; axis: ScrollAxis }
) => boolean;

type ScrollContext = {
  scrollProgress: number;
  previousScrollProgress: number;
  isScrollingPaused: boolean;
  setIsScrollingPaused: (isPaused: boolean) => void;
  // Duration (in seconds) of the camera animation to the current camera stop, so content can appear in sync with it
  cameraAnimationDuration: number;
  setCameraAnimationDuration: (duration: number) => void;
  // Jump straight to any camera stop
  goToScrollProgress: (target: number) => void;
  // Move one step in a direction (respects interceptors and the animation lock)
  scrollBy: (
    direction: ScrollDirection,
    source?: ScrollInputSource,
    axis?: ScrollAxis
  ) => boolean;
  registerScrollInterceptor: (
    scrollProgress: number,
    interceptor: ScrollInterceptor
  ) => () => void;
};

/**
 * Initialization
 */
const initialScrollContext: ScrollContext = {
  scrollProgress: 0,
  previousScrollProgress: 0,
  isScrollingPaused: false,
  setIsScrollingPaused: () => {},
  cameraAnimationDuration: 0,
  setCameraAnimationDuration: () => {},
  goToScrollProgress: () => {},
  scrollBy: () => false,
  registerScrollInterceptor: () => () => {},
};

export const ScrollContext = createContext<ScrollContext>(initialScrollContext);

/**
 * DOM helpers
 */
const blockingAncestorsSelector =
  '[role="dialog"],[role="alertdialog"],[role="listbox"],[role="menu"],[cmdk-root],[data-scroll-lock-ignore]';

function hasOpenModal() {
  return !!document.querySelector(
    '[role="dialog"][data-state="open"],[role="alertdialog"][data-state="open"],[role="listbox"][data-state="open"],[data-blocking-overlay]'
  );
}

function isInsideBlockingElement(target: EventTarget | null) {
  return (
    target instanceof Element && !!target.closest(blockingAncestorsSelector)
  );
}

function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
    target.getAttribute("role") === "slider"
  );
}

function isInteractiveElement(target: EventTarget | null) {
  return (
    target instanceof Element &&
    !!target.closest('button,a,[role="button"],[role="tab"],summary')
  );
}

// Sideways input over elements that scroll horizontally (e.g. the navigation on narrow screens) belongs to them
function isInsideHorizontalScrollArea(target: EventTarget | null) {
  return (
    target instanceof Element && !!target.closest("[data-horizontal-scroll-area]")
  );
}

// Find the closest element that scrolls on its own (marked with data-scroll-area)
function findScrollArea(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>("[data-scroll-area]");
}

function canScrollAreaScroll(
  scrollArea: HTMLElement | null,
  direction: ScrollDirection
) {
  if (!scrollArea) return false;
  const maxScrollTop = scrollArea.scrollHeight - scrollArea.clientHeight;
  if (maxScrollTop <= 1) return false;
  return direction > 0
    ? scrollArea.scrollTop < maxScrollTop - 1
    : scrollArea.scrollTop > 1;
}

/**
 * Provider
 */
export function ScrollContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { canStartCapturingScroll, hasStartedExperience } =
    useSettingsContext();
  const [progress, setProgress] = useState({
    scrollProgress: 0,
    previousScrollProgress: 0,
  });
  const [isScrollingPaused, setIsScrollingPausedState] = useState(false);
  const [cameraAnimationDuration, setCameraAnimationDuration] = useState(0);

  // Refs mirror the state so that event listeners never read stale values
  const progressRef = useRef(progress);
  const isScrollingPausedRef = useRef(false);
  const canStartCapturingScrollRef = useRef(canStartCapturingScroll);
  const hasStartedExperienceRef = useRef(hasStartedExperience);
  const interceptorsRef = useRef(new Map<number, ScrollInterceptor>());

  useEffect(() => {
    canStartCapturingScrollRef.current = canStartCapturingScroll;
    hasStartedExperienceRef.current = hasStartedExperience;
  }, [canStartCapturingScroll, hasStartedExperience]);

  const setIsScrollingPaused = useCallback((isPaused: boolean) => {
    isScrollingPausedRef.current = isPaused;
    setIsScrollingPausedState(isPaused);
  }, []);

  const goToScrollProgress = useCallback(
    (target: number) => {
      // Nothing moves behind the startup screen
      if (!hasStartedExperienceRef.current) return;

      const clampedTarget = Math.min(
        MAX_SCROLL_PROGRESS,
        Math.max(MIN_SCROLL_PROGRESS, Math.round(target))
      );
      const { scrollProgress } = progressRef.current;
      if (clampedTarget === scrollProgress) return;

      progressRef.current = {
        scrollProgress: clampedTarget,
        previousScrollProgress: scrollProgress,
      };
      setProgress(progressRef.current);
      // Camera controls unpause scrolling once the camera animation is finished
      setIsScrollingPaused(true);
    },
    [setIsScrollingPaused]
  );

  const scrollBy = useCallback(
    (
      direction: ScrollDirection,
      source: ScrollInputSource = "button",
      axis: ScrollAxis = "vertical"
    ) => {
      if (!canStartCapturingScrollRef.current || isScrollingPausedRef.current)
        return false;

      const { scrollProgress } = progressRef.current;
      const interceptor = interceptorsRef.current.get(scrollProgress);
      if (interceptor?.(direction, { source, axis })) return true;
      if (axis === "horizontal") return false;

      const nextScrollProgress = scrollProgress + direction;
      if (
        nextScrollProgress < MIN_SCROLL_PROGRESS ||
        nextScrollProgress > MAX_SCROLL_PROGRESS
      )
        return false;

      goToScrollProgress(nextScrollProgress);
      return true;
    },
    [goToScrollProgress]
  );

  const registerScrollInterceptor = useCallback(
    (scrollProgress: number, interceptor: ScrollInterceptor) => {
      interceptorsRef.current.set(scrollProgress, interceptor);
      return () => {
        if (interceptorsRef.current.get(scrollProgress) === interceptor)
          interceptorsRef.current.delete(scrollProgress);
      };
    },
    []
  );

  // Global input listeners (wheel, keyboard and touch)
  useEffect(() => {
    const wheelGesture = { lastEventTime: 0, accumulated: 0, consumed: false };
    let touchStart: {
      x: number;
      y: number;
      time: number;
      target: EventTarget | null;
      scrollArea: HTMLElement | null;
      scrollTop: number;
    } | null = null;

    function isInputBlocked(target: EventTarget | null) {
      return (
        !canStartCapturingScrollRef.current ||
        hasOpenModal() ||
        isInsideBlockingElement(target)
      );
    }

    function handleWheel(e: WheelEvent) {
      const isZooming = e.ctrlKey;
      // Prevented by an open select / dialog (scroll lock)
      if (e.defaultPrevented || isZooming || isInputBlocked(e.target)) return;

      // Normalize line/page based deltas (Firefox) to pixels
      const deltaModeMultiplier =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const deltaX = e.deltaX * deltaModeMultiplier;
      const deltaY = e.deltaY * deltaModeMultiplier;

      const now = performance.now();
      const isNewGesture =
        now - wheelGesture.lastEventTime > wheelGestureGapMs;
      wheelGesture.lastEventTime = now;
      if (isNewGesture) {
        wheelGesture.accumulated = 0;
        wheelGesture.consumed = false;
      }
      // One gesture moves the experience at most once, the rest (e.g. trackpad inertia) is ignored
      if (wheelGesture.consumed) return;

      const axis: ScrollAxis =
        Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
      if (axis === "horizontal" && isInsideHorizontalScrollArea(e.target))
        return;
      wheelGesture.accumulated += axis === "vertical" ? deltaY : deltaX;
      if (Math.abs(wheelGesture.accumulated) < wheelGestureThreshold) return;

      const direction: ScrollDirection =
        wheelGesture.accumulated > 0 ? 1 : -1;
      wheelGesture.consumed = true;

      // Let lists with their own scrollbar scroll natively until they reach their end
      if (
        axis === "vertical" &&
        canScrollAreaScroll(findScrollArea(e.target), direction)
      )
        return;

      scrollBy(direction, "wheel", axis);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (isInputBlocked(e.target) || isEditableElement(e.target)) return;

      let direction: ScrollDirection;
      let axis: ScrollAxis = "vertical";

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          direction = 1;
          break;
        case "ArrowUp":
        case "PageUp":
          direction = -1;
          break;
        case " ":
          if (isInteractiveElement(e.target)) return;
          direction = e.shiftKey ? -1 : 1;
          break;
        case "ArrowRight":
          direction = 1;
          axis = "horizontal";
          break;
        case "ArrowLeft":
          direction = -1;
          axis = "horizontal";
          break;
        case "Home":
          e.preventDefault();
          goToScrollProgress(MIN_SCROLL_PROGRESS);
          return;
        case "End":
          e.preventDefault();
          goToScrollProgress(MAX_SCROLL_PROGRESS);
          return;
        default:
          return;
      }

      // Arrow keys inside a scrollable list scroll the list first
      const scrollArea = findScrollArea(e.target);
      if (axis === "vertical" && canScrollAreaScroll(scrollArea, direction))
        return;

      if (axis === "vertical") e.preventDefault();
      if (e.repeat) return;
      const isHandled = scrollBy(direction, "keyboard", axis);
      if (isHandled) e.preventDefault();
    }

    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) {
        touchStart = null;
        return;
      }
      const touch = e.touches[0];
      const scrollArea = findScrollArea(e.target);
      touchStart = {
        x: touch.clientX,
        y: touch.clientY,
        time: performance.now(),
        target: e.target,
        scrollArea,
        scrollTop: scrollArea?.scrollTop ?? 0,
      };
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!touchStart) return;
      const start = touchStart;
      touchStart = null;

      const touch = e.changedTouches[0];
      if (!touch) return;
      if (performance.now() - start.time > swipeMaxDurationMs) return;
      if (isInputBlocked(start.target) || isEditableElement(start.target))
        return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < swipeThreshold)
        return;

      const axis: ScrollAxis =
        Math.abs(deltaX) > Math.abs(deltaY) * 1.2 ? "horizontal" : "vertical";
      if (axis === "horizontal" && isInsideHorizontalScrollArea(start.target))
        return;
      // Swiping up/left moves forward, like scrolling a page
      const direction: ScrollDirection =
        (axis === "vertical" ? deltaY : deltaX) < 0 ? 1 : -1;

      // Inner scroll areas consume the swipe until they're scrolled to their end
      if (axis === "vertical" && start.scrollArea) {
        const hasScrolledNatively =
          Math.abs(start.scrollArea.scrollTop - start.scrollTop) > 2;
        if (
          hasScrolledNatively ||
          canScrollAreaScroll(start.scrollArea, direction)
        )
          return;
      }

      scrollBy(direction, "touch", axis);
    }

    function handleTouchCancel() {
      touchStart = null;
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [scrollBy, goToScrollProgress]);

  const value = useMemo(
    () => ({
      ...progress,
      isScrollingPaused,
      setIsScrollingPaused,
      cameraAnimationDuration,
      setCameraAnimationDuration,
      goToScrollProgress,
      scrollBy,
      registerScrollInterceptor,
    }),
    [
      cameraAnimationDuration,
      progress,
      isScrollingPaused,
      setIsScrollingPaused,
      goToScrollProgress,
      scrollBy,
      registerScrollInterceptor,
    ]
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

/**
 * Hook
 */
export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (context === undefined)
    throw new Error(
      "useScrollContext was used outside of ScrollContextProvider!"
    );
  return context;
}
