import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import useUpdateShaderUniforms from "@/canvases/hooks/useUpdateShaderUniforms";
import useEarthDebugControls from "@/canvases/space/earth/hooks/useEarthDebugControls";
import useLoadEarthTextures from "@/canvases/space/earth/hooks/useLoadEarthTextures";
import useSetEarthPosition from "@/canvases/space/earth/hooks/useSetEarthPosition";
import EarthAtmosphereShaderMaterial from "@/canvases/space/earth/shaders/atmosphere/material";
import EarthBaseShaderMaterial from "@/canvases/space/earth/shaders/base/material";
import EarthCloudsShaderMaterial from "@/canvases/space/earth/shaders/clouds/material";
import { useSettingsContext } from "@/contexts/SettingsContext";

/**
 * Extend shader materials and type them
 */
extend({
  EarthBaseShaderMaterial,
  EarthAtmosphereShaderMaterial,
  EarthCloudsShaderMaterial,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    earthBaseShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof EarthBaseShaderMaterial> };

    earthAtmosphereShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof EarthAtmosphereShaderMaterial> };

    earthCloudsShaderMaterial: React.JSX.IntrinsicElements["shaderMaterial"] & {
      [key: string]: any;
      attach?: string;
      args?: any;
    } & { ref?: React.Ref<typeof EarthCloudsShaderMaterial> };
  }
}

function EarthModel() {
  const earthBaseShaderMaterialRef = useRef(null);
  const earthAtmosphereShaderMaterialRef = useRef(null);
  const earthCloudsShaderMaterialRef = useRef(null);
  const earthRef = useRef<THREE.Group>(null);
  const earthCloudsRef = useRef<THREE.Mesh>(null);
  const { sphereSegments } = useSettingsContext();

  const earthSphereSegments = sphereSegments;

  // Load textures
  const [earthDayTexture, earthNightTexture, earthSpecularCloudsTexture] =
    useLoadEarthTextures();

  // Update uniforms
  useUpdateShaderUniforms(earthBaseShaderMaterialRef);
  useUpdateShaderUniforms(earthAtmosphereShaderMaterialRef);
  useUpdateShaderUniforms(earthCloudsShaderMaterialRef);

  // Debug controls
  const { "Spherical phi value": phi, "Spherical theta value": theta } =
    useEarthDebugControls();

  // Position the Earth
  useSetEarthPosition(phi, theta, earthRef);

  // Rotate the clouds on their own axis
  useFrame((_, delta) => {
    if (!earthCloudsRef.current) return;
    earthCloudsRef.current.rotation.y += delta * 0.025;
    earthCloudsRef.current.rotation.z += Math.sin(delta) * 0.025;
  });

  return (
    <group ref={earthRef}>
      {/* Earth base */}
      <mesh>
        <sphereGeometry args={[2, earthSphereSegments, earthSphereSegments]} />
        <earthBaseShaderMaterial
          ref={earthBaseShaderMaterialRef}
          uEarthDayTexture={earthDayTexture}
          uEarthNightTexture={earthNightTexture}
          uEarthSpecularCloudsTexture={earthSpecularCloudsTexture}
        />
      </mesh>

      {/* Earth atmosphere */}
      <mesh>
        <sphereGeometry
          args={[2.08, earthSphereSegments, earthSphereSegments]}
        />
        <earthAtmosphereShaderMaterial
          ref={earthAtmosphereShaderMaterialRef}
          transparent
          side={THREE.BackSide}
        />
      </mesh>

      {/* Earth clouds */}
      <mesh ref={earthCloudsRef}>
        <sphereGeometry
          args={[2.025, earthSphereSegments, earthSphereSegments]}
        />
        <earthCloudsShaderMaterial
          ref={earthCloudsShaderMaterialRef}
          uEarthSpecularCloudsTexture={earthSpecularCloudsTexture}
          transparent
        />
      </mesh>
    </group>
  );
}

export default EarthModel;
