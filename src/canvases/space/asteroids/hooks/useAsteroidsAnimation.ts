import { useAnimations } from "@react-three/drei";
import { useEffect } from "react";
import type * as THREE from "three";

function useAsteroidsAnimation(
  animations: THREE.AnimationClip[],
  animationSpeed = 0.075
) {
  const { ref, actions } = useAnimations(animations);

  useEffect(() => {
    const rotateAnimation = actions?.["Take 001"];
    if (!rotateAnimation) return;

    rotateAnimation.play();
    rotateAnimation.timeScale = animationSpeed;

    return () => {
      rotateAnimation.stop();
    };
  }, [actions, animationSpeed]);

  return ref;
}

export default useAsteroidsAnimation;
