import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

import useAsteroidsAnimation from "@/canvases/space/asteroids/hooks/useAsteroidsAnimation";

const asteroidsModelUrl = "/assets/models/asteroids.glb";

function AsteroidsModel({ animationSpeed }: { animationSpeed?: number }) {
  const model = useGLTF(asteroidsModelUrl);

  // Clone once per instance (cloning on every render created new objects and leaked animation mixers)
  const scene = useMemo(() => model.scene.clone(true), [model.scene]);

  const animationRef = useAsteroidsAnimation(model.animations, animationSpeed);

  return <primitive ref={animationRef} object={scene} />;
}

useGLTF.preload(asteroidsModelUrl);

export default AsteroidsModel;
