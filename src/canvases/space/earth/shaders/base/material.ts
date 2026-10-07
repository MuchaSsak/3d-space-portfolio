import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import earthBaseFragmentShader from "@/canvases/space/earth/shaders/base/fragment";
import earthBaseVertexShader from "@/canvases/space/earth/shaders/base/vertex";

const EarthBaseShaderMaterial = shaderMaterial(
  {
    uEarthDirection: new THREE.Vector3(),

    uEarthDayTexture: null,
    uEarthNightTexture: null,
    uEarthSpecularCloudsTexture: null,

    uEarthAtmosphereDayColor: new THREE.Color(),
    uEarthAtmosphereTwilightColor: new THREE.Color(),

    uEarthSpecularIntensity: 0,
    uEarthSpecularOpacity: 0,
    uEarthSpecularColor: new THREE.Color(),
  },
  earthBaseVertexShader,
  earthBaseFragmentShader
);

export default EarthBaseShaderMaterial;
