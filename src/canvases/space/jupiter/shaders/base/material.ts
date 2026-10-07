import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import jupiterBaseFragmentShader from "@/canvases/space/jupiter/shaders/base/fragment";
import jupiterBaseVertexShader from "@/canvases/space/jupiter/shaders/base/vertex";

const JupiterBaseShaderMaterial = shaderMaterial(
  {
    uJupiterDirection: new THREE.Vector3(),

    uJupiterTexture: null,

    uJupiterAtmosphereDayColor: new THREE.Color(),
    uJupiterAtmosphereTwilightColor: new THREE.Color(),
  },
  jupiterBaseVertexShader,
  jupiterBaseFragmentShader
);

export default JupiterBaseShaderMaterial;
