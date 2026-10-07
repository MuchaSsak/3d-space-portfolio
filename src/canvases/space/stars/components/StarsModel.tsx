import { extend, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import useStarsBufferPositions from "@/canvases/space/stars/hooks/useStarsBufferPositions";
import useStarsBufferSizes from "@/canvases/space/stars/hooks/useStarsBufferSizes";
import StarsShaderMaterial from "@/canvases/space/stars/shaders/stars/material";
import { skipRaycast } from "@/lib/utils";

/**
 * Extend shader materials and type them
 */
extend({
  StarsShaderMaterial,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    starsShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof StarsShaderMaterial> };
  }
}

const starsCount = 5000;
// Just inside the camera's far plane, so the stars are always behind everything else
const skyDomeRadius = 2800;

/**
 * A dome of stars that follows the camera, so they look infinitely far away.
 * (Rendering them into a 2048px half float cube map instead cost ~200 MB of video memory.)
 */
function StarsModel() {
  const skyDomeRef = useRef<THREE.Group>(null);
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);

  // Stars keep the same size relative to the screen height (in drawing buffer pixels)
  const uResolution = useMemo(
    () => new THREE.Vector2(size.width * dpr, size.height * dpr),
    [size.width, size.height, dpr]
  );

  const bufferPositions = useStarsBufferPositions(starsCount);
  const bufferSizes = useStarsBufferSizes(starsCount);

  useFrame(({ camera }) => {
    skyDomeRef.current?.position.copy(camera.position);
  });

  return (
    <>
      <color attach="background" args={["#09090b"]} />

      <group ref={skyDomeRef}>
        <points
          // Never occludes the lens flare, and testing 5000 points every frame is wasted work
          raycast={skipRaycast}
          scale={skyDomeRadius}
          renderOrder={-1}
          frustumCulled={false}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[bufferPositions, 3]}
            />
            <bufferAttribute
              attach="attributes-aSize"
              args={[bufferSizes, 1]}
            />
          </bufferGeometry>

          <starsShaderMaterial
            uResolution={uResolution}
            depthWrite={false}
            transparent
          />
        </points>
      </group>
    </>
  );
}

export default StarsModel;
