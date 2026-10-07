import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import neptuneAtmosphereFragmentShader from "@/canvases/space/neptune/shaders/atmosphere/fragment";
import neptuneAtmosphereVertexShader from "@/canvases/space/neptune/shaders/atmosphere/vertex";

const NeptuneAtmosphereShaderMaterial = shaderMaterial(
  {
    uNeptuneDirection: new THREE.Vector3(),

    uNeptuneAtmosphereDayColor: new THREE.Color(),
    uNeptuneAtmosphereTwilightColor: new THREE.Color(),
  },
  neptuneAtmosphereVertexShader,
  neptuneAtmosphereFragmentShader
);

export default NeptuneAtmosphereShaderMaterial;
