import { extend } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import useUpdateShaderUniforms from "@/canvases/hooks/useUpdateShaderUniforms";
import useJupiterDebugControls from "@/canvases/space/jupiter/hooks/useJupiterDebugControls";
import useLoadJupiterTextures from "@/canvases/space/jupiter/hooks/useLoadJupiterTextures";
import useSetJupiterPosition from "@/canvases/space/jupiter/hooks/useSetJupiterPosition";
import JupiterAtmosphereShaderMaterial from "@/canvases/space/jupiter/shaders/atmosphere/material";
import JupiterBaseShaderMaterial from "@/canvases/space/jupiter/shaders/base/material";
import { useSettingsContext } from "@/contexts/SettingsContext";

/**
 * Extend shader materials and type them
 */
extend({
  JupiterBaseShaderMaterial,
  JupiterAtmosphereShaderMaterial,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    jupiterBaseShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof JupiterBaseShaderMaterial> };

    jupiterAtmosphereShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof JupiterAtmosphereShaderMaterial> };
  }
}

function JupiterModel() {
  const jupiterBaseShaderMaterialRef = useRef(null);
  const jupiterAtmosphereShaderMaterialRef = useRef(null);
  const jupiterRef = useRef<THREE.Group>(null);
  const { sphereSegments } = useSettingsContext();

  const jupiterSphereSegments = sphereSegments;

  // Load textures
  const [jupiterTexture] = useLoadJupiterTextures();

  // Debug controls
  const { "Spherical phi value": phi, "Spherical theta value": theta } =
    useJupiterDebugControls();

  // Position the Jupiter
  useSetJupiterPosition(phi, theta, jupiterRef);

  // Update uniforms
  useUpdateShaderUniforms(jupiterBaseShaderMaterialRef);
  useUpdateShaderUniforms(jupiterAtmosphereShaderMaterialRef);

  return (
    <group rotation-z={-Math.PI * 1.07} ref={jupiterRef}>
      {/* Jupiter base */}
      <mesh>
        <sphereGeometry
          args={[32.25, jupiterSphereSegments, jupiterSphereSegments]}
        />
        <jupiterBaseShaderMaterial
          ref={jupiterBaseShaderMaterialRef}
          uJupiterTexture={jupiterTexture}
        />
      </mesh>

      {/* Jupiter atmosphere */}
      <mesh>
        <sphereGeometry
          args={[32.7, jupiterSphereSegments, jupiterSphereSegments]}
        />
        <jupiterAtmosphereShaderMaterial
          ref={jupiterAtmosphereShaderMaterialRef}
          transparent
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default JupiterModel;
