import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import saturnRingFragmentShader from "@/canvases/space/saturn/shaders/ring/fragment";
import saturnRingVertexShader from "@/canvases/space/saturn/shaders/ring/vertex";

const SaturnRingShaderMaterial = shaderMaterial(
  {
    uSaturnDirection: new THREE.Vector3(),

    uSaturnRingTexture: null,
  },
  saturnRingVertexShader,
  saturnRingFragmentShader
);

export default SaturnRingShaderMaterial;
