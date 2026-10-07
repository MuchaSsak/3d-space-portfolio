import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import jupiterAtmosphereFragmentShader from "@/canvases/space/jupiter/shaders/atmosphere/fragment";
import jupiterAtmosphereVertexShader from "@/canvases/space/jupiter/shaders/atmosphere/vertex";

const JupiterAtmosphereShaderMaterial = shaderMaterial(
  {
    uJupiterDirection: new THREE.Vector3(),

    uJupiterAtmosphereDayColor: new THREE.Color(),
    uJupiterAtmosphereTwilightColor: new THREE.Color(),
  },
  jupiterAtmosphereVertexShader,
  jupiterAtmosphereFragmentShader
);

export default JupiterAtmosphereShaderMaterial;
