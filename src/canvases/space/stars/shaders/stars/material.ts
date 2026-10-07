import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import starsFragmentShader from "@/canvases/space/stars/shaders/stars/fragment";
import starsVertexShader from "@/canvases/space/stars/shaders/stars/vertex";

const StarsShaderMaterial = shaderMaterial(
  {
    uResolution: new THREE.Vector2(),
  },
  starsVertexShader,
  starsFragmentShader
);

export default StarsShaderMaterial;
