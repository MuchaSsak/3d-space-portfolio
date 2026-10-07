import { extend } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import useUpdateShaderUniforms from "@/canvases/hooks/useUpdateShaderUniforms";
import useLoadMarsTextures from "@/canvases/space/mars/hooks/useLoadMarsTextures";
import useMarsDebugControls from "@/canvases/space/mars/hooks/useMarsDebugControls";
import useSetMarsPosition from "@/canvases/space/mars/hooks/useSetMarsPosition";
import MarsAtmosphereShaderMaterial from "@/canvases/space/mars/shaders/atmosphere/material";
import MarsBaseShaderMaterial from "@/canvases/space/mars/shaders/base/material";
import { useSettingsContext } from "@/contexts/SettingsContext";

/**
 * Extend shader materials and type them
 */
extend({
  MarsBaseShaderMaterial,
  MarsAtmosphereShaderMaterial,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    marsBaseShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof MarsBaseShaderMaterial> };

    marsAtmosphereShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof MarsAtmosphereShaderMaterial> };
  }
}

function MarsModel() {
  const marsBaseShaderMaterialRef = useRef(null);
  const marsAtmosphereShaderMaterialRef = useRef(null);
  const marsRef = useRef<THREE.Group>(null);
  const { sphereSegments } = useSettingsContext();

  const marsSphereSegments = sphereSegments;

  // Load textures
  const [marsTexture] = useLoadMarsTextures();

  // Debug controls
  const { "Spherical phi value": phi, "Spherical theta value": theta } =
    useMarsDebugControls();

  // Position the Mars
  useSetMarsPosition(phi, theta, marsRef);

  // Update uniforms
  useUpdateShaderUniforms(marsBaseShaderMaterialRef);
  useUpdateShaderUniforms(marsAtmosphereShaderMaterialRef);

  return (
    <group ref={marsRef}>
      {/* Mars base */}
      <mesh>
        <sphereGeometry args={[1.5, marsSphereSegments, marsSphereSegments]} />
        <marsBaseShaderMaterial
          ref={marsBaseShaderMaterialRef}
          uMarsTexture={marsTexture}
        />
      </mesh>

      {/* Mars atmosphere */}
      <mesh>
        <sphereGeometry args={[1.63, marsSphereSegments, marsSphereSegments]} />
        <marsAtmosphereShaderMaterial
          ref={marsAtmosphereShaderMaterialRef}
          transparent
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default MarsModel;
