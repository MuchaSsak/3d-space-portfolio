import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import earthAtmosphereFragmentShader from "@/canvases/space/earth/shaders/atmosphere/fragment";
import earthAtmosphereVertexShader from "@/canvases/space/earth/shaders/atmosphere/vertex";

const EarthAtmosphereShaderMaterial = shaderMaterial(
  {
    uEarthDirection: new THREE.Vector3(),

    uEarthAtmosphereDayColor: new THREE.Color(),
    uEarthAtmosphereTwilightColor: new THREE.Color(),
  },
  earthAtmosphereVertexShader,
  earthAtmosphereFragmentShader
);

export default EarthAtmosphereShaderMaterial;
