import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import marsBaseFragmentShader from "@/canvases/space/mars/shaders/base/fragment";
import marsBaseVertexShader from "@/canvases/space/mars/shaders/base/vertex";

const MarsBaseShaderMaterial = shaderMaterial(
  {
    uMarsDirection: new THREE.Vector3(),

    uMarsTexture: null,

    uMarsAtmosphereDayColor: new THREE.Color(),
    uMarsAtmosphereTwilightColor: new THREE.Color(),
  },
  marsBaseVertexShader,
  marsBaseFragmentShader
);

export default MarsBaseShaderMaterial;
