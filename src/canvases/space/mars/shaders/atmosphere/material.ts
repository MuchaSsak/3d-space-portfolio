import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import marsAtmosphereFragmentShader from "@/canvases/space/mars/shaders/atmosphere/fragment";
import marsAtmosphereVertexShader from "@/canvases/space/mars/shaders/atmosphere/vertex";

const MarsAtmosphereShaderMaterial = shaderMaterial(
  {
    uMarsDirection: new THREE.Vector3(),

    uMarsAtmosphereDayColor: new THREE.Color(),
    uMarsAtmosphereTwilightColor: new THREE.Color(),
  },
  marsAtmosphereVertexShader,
  marsAtmosphereFragmentShader
);

export default MarsAtmosphereShaderMaterial;
