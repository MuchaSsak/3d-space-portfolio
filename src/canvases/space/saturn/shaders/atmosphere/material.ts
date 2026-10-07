import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import saturnAtmosphereFragmentShader from "@/canvases/space/saturn/shaders/atmosphere/fragment";
import saturnAtmosphereVertexShader from "@/canvases/space/saturn/shaders/atmosphere/vertex";

const SaturnAtmosphereShaderMaterial = shaderMaterial(
  {
    uSaturnDirection: new THREE.Vector3(),

    uSaturnAtmosphereDayColor: new THREE.Color(),
    uSaturnAtmosphereTwilightColor: new THREE.Color(),
  },
  saturnAtmosphereVertexShader,
  saturnAtmosphereFragmentShader
);

export default SaturnAtmosphereShaderMaterial;
