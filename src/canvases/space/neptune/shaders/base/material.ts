import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import neptuneBaseFragmentShader from "@/canvases/space/neptune/shaders/base/fragment";
import neptuneBaseVertexShader from "@/canvases/space/neptune/shaders/base/vertex";

const NeptuneBaseShaderMaterial = shaderMaterial(
  {
    uNeptuneDirection: new THREE.Vector3(),

    uNeptuneTexture: null,

    uNeptuneAtmosphereDayColor: new THREE.Color(),
    uNeptuneAtmosphereTwilightColor: new THREE.Color(),
  },
  neptuneBaseVertexShader,
  neptuneBaseFragmentShader
);

export default NeptuneBaseShaderMaterial;
