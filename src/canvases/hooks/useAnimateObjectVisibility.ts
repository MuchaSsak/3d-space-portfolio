import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useScrollContext } from "@/contexts/ScrollContext";

export type HideableObject = THREE.Material | HTMLElement;

type AnimationOptions = Pick<gsap.TweenVars, "delay" | "duration" | "ease">;

type UseAnimateObjectVisibilityOptions = {
  // Inclusive scroll progress range where the objects are visible
  visibleRange: [number, number];
  // Inclusive scroll progress range where the objects are mounted at all (unmounted otherwise to save resources)
  renderedRange?: [number, number];
  showOptions?: AnimationOptions;
  hideOptions?: AnimationOptions;
};

function isInRange(value: number, range: [number, number]) {
  return value >= range[0] && value <= range[1];
}

/**
 * Fades registered materials / HTML elements in and out depending on the current scroll progress.
 * Register objects by passing `register` as their ref.
 */
function useAnimateObjectVisibility({
  visibleRange,
  renderedRange,
  showOptions,
  hideOptions,
}: UseAnimateObjectVisibilityOptions) {
  const { scrollProgress } = useScrollContext();
  const objectsRef = useRef(new Set<HideableObject>());
  const [isRendered, setIsRendered] = useState(false);
  const isVisible = isInRange(scrollProgress, visibleRange);
  const latestShowAnimationRef = useRef<gsap.TweenVars | null>(null);

  // Ref callback with cleanup (React 19), so objects are tracked exactly once while they're mounted
  const register = useCallback((object: HideableObject | null) => {
    if (!object) return;
    objectsRef.current.add(object);

    // Objects mounted while their section is already visible (e.g. content of <Html /> that renders asynchronously) fade in right away
    if (latestShowAnimationRef.current)
      gsap.to(object, latestShowAnimationRef.current);

    return () => {
      gsap.killTweensOf(object);
      objectsRef.current.delete(object);
    };
  }, []);

  // Primitive dependencies, so inline option objects don't restart the animations on every render
  const [visibleFrom, visibleTo] = visibleRange;
  const [renderedFrom, renderedTo] = renderedRange ?? [];
  const showDelay = Number(showOptions?.delay ?? 0);
  const showDuration = Number(showOptions?.duration ?? 1);
  const showEase = showOptions?.ease;
  const hideDelay = Number(hideOptions?.delay ?? 0);
  const hideDuration = Number(hideOptions?.duration ?? 1);
  const hideEase = hideOptions?.ease;

  // Toggle rendering and therefore remove geometry when it's not needed
  useEffect(() => {
    if (renderedFrom === undefined || renderedTo === undefined) return;

    const shouldBeRendered = isInRange(scrollProgress, [
      renderedFrom,
      renderedTo,
    ]);
    // Mount right away, unmount once the fade out is over
    const delayedCall = gsap.delayedCall(
      shouldBeRendered ? 0 : hideDelay + hideDuration,
      () => setIsRendered(shouldBeRendered)
    );

    return () => {
      delayedCall.kill();
    };
  }, [scrollProgress, renderedFrom, renderedTo, hideDelay, hideDuration]);

  // Animate opacity of all registered objects
  useEffect(() => {
    const showAnimation: gsap.TweenVars = {
      opacity: 1,
      delay: showDelay,
      duration: showDuration,
      ease: showEase,
    };
    const hideAnimation: gsap.TweenVars = {
      opacity: 0,
      delay: hideDelay,
      duration: hideDuration,
      ease: hideEase,
    };
    latestShowAnimationRef.current = isVisible ? showAnimation : null;

    objectsRef.current.forEach((object) => {
      gsap.killTweensOf(object, "opacity");
      gsap.to(object, isVisible ? showAnimation : hideAnimation);
    });
    // isRendered re-runs the animation for objects that got mounted after the scroll progress changed
  }, [
    isVisible,
    isRendered,
    visibleFrom,
    visibleTo,
    showDelay,
    showDuration,
    showEase,
    hideDelay,
    hideDuration,
    hideEase,
  ]);

  return { register, isRendered, isVisible };
}

export default useAnimateObjectVisibility;
