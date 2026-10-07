import { extend } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import useUpdateShaderUniforms from "@/canvases/hooks/useUpdateShaderUniforms";
import useLoadSaturnTextures from "@/canvases/space/saturn/hooks/useLoadSaturnTextures";
import useSaturnDebugControls from "@/canvases/space/saturn/hooks/useSaturnDebugControls";
import useSaturnRingGeometry from "@/canvases/space/saturn/hooks/useSaturnRingGeometry";
import useSetSaturnPosition from "@/canvases/space/saturn/hooks/useSetSaturnPosition";
import SaturnAtmosphereShaderMaterial from "@/canvases/space/saturn/shaders/atmosphere/material";
import SaturnBaseShaderMaterial from "@/canvases/space/saturn/shaders/base/material";
import SaturnRingShaderMaterial from "@/canvases/space/saturn/shaders/ring/material";
import { useSettingsContext } from "@/contexts/SettingsContext";

/**
 * Extend shader materials and type them
 */
extend({
  SaturnBaseShaderMaterial,
  SaturnAtmosphereShaderMaterial,
  SaturnRingShaderMaterial,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    saturnBaseShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof SaturnBaseShaderMaterial> };

    saturnAtmosphereShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof SaturnAtmosphereShaderMaterial> };

    saturnRingShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof SaturnRingShaderMaterial> };
  }
}

function SaturnModel() {
  const saturnBaseShaderMaterialRef = useRef(null);
  const saturnAtmosphereShaderMaterialRef = useRef(null);
  const saturnRingShaderMaterialRef = useRef(null);
  const saturnRef = useRef<THREE.Group>(null);
  const saturnRingGeometry = useSaturnRingGeometry();
  const { sphereSegments } = useSettingsContext();

  const saturnSphereSegments = sphereSegments;

  // Load textures
  const [saturnTexture, saturnRingTexture] = useLoadSaturnTextures();

  // Debug controls
  const { "Spherical phi value": phi, "Spherical theta value": theta } =
    useSaturnDebugControls();

  // Position the Saturn
  useSetSaturnPosition(phi, theta, saturnRef);

  // Update uniforms
  useUpdateShaderUniforms(saturnBaseShaderMaterialRef);
  useUpdateShaderUniforms(saturnAtmosphereShaderMaterialRef);
  useUpdateShaderUniforms(saturnRingShaderMaterialRef);

  return (
    <group ref={saturnRef}>
      {/* Saturn base */}
      <mesh rotation-x={Math.PI * -0.025} rotation-z={Math.PI * 0.1}>
        <sphereGeometry
          args={[40, saturnSphereSegments, saturnSphereSegments]}
        />
        <saturnBaseShaderMaterial
          ref={saturnBaseShaderMaterialRef}
          uSaturnTexture={saturnTexture}
        />
      </mesh>

      {/* Saturn atmosphere */}
      <mesh>
        <sphereGeometry
          args={[41, saturnSphereSegments, saturnSphereSegments]}
        />
        <saturnAtmosphereShaderMaterial
          ref={saturnAtmosphereShaderMaterialRef}
          transparent
          side={THREE.BackSide}
        />
      </mesh>

      {/* Saturn ring */}
      <mesh
        scale={12.75}
        rotation={[Math.PI * 0.48, -Math.PI * -0.1, 0]}
        geometry={saturnRingGeometry}
      >
        <saturnRingShaderMaterial
          ref={saturnRingShaderMaterialRef}
          uSaturnRingTexture={saturnRingTexture}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default SaturnModel;
