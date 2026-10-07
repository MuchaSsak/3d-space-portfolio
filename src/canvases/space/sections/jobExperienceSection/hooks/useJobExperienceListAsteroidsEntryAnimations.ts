import gsap from "gsap";
import { useEffect } from "react";
import * as THREE from "three";

import { useScrollContext } from "@/contexts/ScrollContext";
import { jobExperienceListScrollProgress } from "@/lib/sections";

export type AsteroidEntryAnimation = {
  ref: React.RefObject<THREE.Group | null>;
  // Position while the job experience list is shown
  inPosition: [number, number, number];
  // Position outside of the list (the asteroids fly away)
  outPosition: [number, number, number];
  outEase?: string;
};

// Animate position in and out of the asteroids
function useJobExperienceListAsteroidsEntryAnimations(
  asteroids: AsteroidEntryAnimation[],
  // The asteroids are mounted lazily, the animation has to start once they exist
  isRendered: boolean
) {
  const { scrollProgress } = useScrollContext();
  const isListShown = scrollProgress === jobExperienceListScrollProgress;

  useEffect(() => {
    const tweens = asteroids.map(({ ref, inPosition, outPosition, outEase }) => {
      if (!ref.current) return null;
      const [x, y, z] = isListShown ? inPosition : outPosition;

      return gsap.to(ref.current.position, {
        ease: isListShown ? "sine.out" : (outEase ?? "sine.out"),
        x,
        y,
        z,
        duration: 3,
      });
    });

    return () => {
      tweens.forEach((tween) => tween?.kill());
    };
  }, [isListShown, asteroids, isRendered]);
}

export default useJobExperienceListAsteroidsEntryAnimations;
