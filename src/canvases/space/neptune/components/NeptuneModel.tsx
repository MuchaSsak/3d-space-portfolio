import { extend } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import useUpdateShaderUniforms from "@/canvases/hooks/useUpdateShaderUniforms";
import useLoadNeptuneTextures from "@/canvases/space/neptune/hooks/useLoadNeptuneTextures";
import useNeptuneDebugControls from "@/canvases/space/neptune/hooks/useNeptuneDebugControls";
import useSetNeptunePosition from "@/canvases/space/neptune/hooks/useSetNeptunePosition";
import NeptuneAtmosphereShaderMaterial from "@/canvases/space/neptune/shaders/atmosphere/material";
import NeptuneBaseShaderMaterial from "@/canvases/space/neptune/shaders/base/material";
import { useSettingsContext } from "@/contexts/SettingsContext";

/**
 * Extend shader materials and type them
 */
extend({
  NeptuneBaseShaderMaterial,
  NeptuneAtmosphereShaderMaterial,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    neptuneBaseShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof NeptuneBaseShaderMaterial> };

    neptuneAtmosphereShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof NeptuneAtmosphereShaderMaterial> };
  }
}

function NeptuneModel() {
  const neptuneBaseShaderMaterialRef = useRef(null);
  const neptuneAtmosphereShaderMaterialRef = useRef(null);
  const neptuneRef = useRef<THREE.Group>(null);
  const { sphereSegments } = useSettingsContext();

  const neptuneSphereSegments = sphereSegments;

  // Load textures
  const [neptuneTexture] = useLoadNeptuneTextures();

  // Debug controls
  const { "Spherical phi value": phi, "Spherical theta value": theta } =
    useNeptuneDebugControls();

  // Position the Neptune
  useSetNeptunePosition(phi, theta, neptuneRef);

  // Update uniforms
  useUpdateShaderUniforms(neptuneBaseShaderMaterialRef);
  useUpdateShaderUniforms(neptuneAtmosphereShaderMaterialRef);

  return (
    <group ref={neptuneRef}>
      {/* Neptune base */}
      <mesh>
        <sphereGeometry
          args={[5, neptuneSphereSegments, neptuneSphereSegments]}
        />
        <neptuneBaseShaderMaterial
          ref={neptuneBaseShaderMaterialRef}
          uNeptuneTexture={neptuneTexture}
        />
      </mesh>

      {/* Neptune atmosphere */}
      <mesh>
        <sphereGeometry
          args={[5.13, neptuneSphereSegments, neptuneSphereSegments]}
        />
        <neptuneAtmosphereShaderMaterial
          ref={neptuneAtmosphereShaderMaterialRef}
          transparent
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default NeptuneModel;
