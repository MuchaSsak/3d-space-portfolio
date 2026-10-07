import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import earthCloudsFragmentShader from "@/canvases/space/earth/shaders/clouds/fragment";
import earthCloudsVertexShader from "@/canvases/space/earth/shaders/clouds/vertex";

const EarthCloudsShaderMaterial = shaderMaterial(
  {
    uEarthDirection: new THREE.Vector3(),

    uEarthSpecularCloudsTexture: null,

    uEarthCloudsAmount: 0,
    uEarthCloudsDayAlpha: 0,
    uEarthCloudsNightAlpha: 0,

    uEarthAtmosphereDayColor: new THREE.Color(),
    uEarthAtmosphereTwilightColor: new THREE.Color(),

    uEarthSpecularIntensity: 0,
    uEarthSpecularOpacity: 0,
    uEarthSpecularColor: new THREE.Color(),
  },
  earthCloudsVertexShader,
  earthCloudsFragmentShader
);

export default EarthCloudsShaderMaterial;
