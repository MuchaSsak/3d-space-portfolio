import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import saturnBaseFragmentShader from "@/canvases/space/saturn/shaders/base/fragment";
import saturnBaseVertexShader from "@/canvases/space/saturn/shaders/base/vertex";

const SaturnBaseShaderMaterial = shaderMaterial(
  {
    uSaturnDirection: new THREE.Vector3(),

    uSaturnTexture: null,

    uSaturnAtmosphereDayColor: new THREE.Color(),
    uSaturnAtmosphereTwilightColor: new THREE.Color(),
  },
  saturnBaseVertexShader,
  saturnBaseFragmentShader
);

export default SaturnBaseShaderMaterial;
