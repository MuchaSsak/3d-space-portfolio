import * as THREE from "three";

import { useSpaceContext } from "@/canvases/space/contexts/SpaceContext";
import { folder, useDebugControls as useControls } from "@/lib/debug";

function useEarthDebugControls() {
  const {
    uniforms: {
      uEarthCloudsAmount,
      setUEarthCloudsAmount,
      uEarthCloudsDayAlpha,
      setUEarthCloudsDayAlpha,
      uEarthCloudsNightAlpha,
      setUEarthCloudsNightAlpha,

      uEarthAtmosphereDayColor,
      setUEarthAtmosphereDayColor,
      uEarthAtmosphereTwilightColor,
      setUEarthAtmosphereTwilightColor,

      uEarthSpecularIntensity,
      setUEarthSpecularIntensity,
      uEarthSpecularOpacity,
      setUEarthSpecularOpacity,
      uEarthSpecularColor,
      setUEarthSpecularColor,
    },
  } = useSpaceContext();

  const controls = useControls(
    "Earth 🌍",
    {
      Position: folder({
        "Spherical phi value": {
          min: 0,
          value: Math.PI * 0.5,
          max: Math.PI,
        },

        "Spherical theta value": {
          min: -Math.PI,
          value: -2.9,
          max: Math.PI,
        },
      }),

      Clouds: folder({
        Amount: {
          min: 0,
          value: uEarthCloudsAmount,
          max: 1,
          onChange: (newValue) => {
            setUEarthCloudsAmount(newValue);
          },
        },
        "Opacity (day)": {
          min: 0,
          value: uEarthCloudsDayAlpha,
          max: 1,
          onChange: (newValue) => {
            setUEarthCloudsDayAlpha(newValue);
          },
        },
        "Opacity (night)": {
          min: 0,
          value: uEarthCloudsNightAlpha,
          max: 1,
          onChange: (newValue) => {
            setUEarthCloudsNightAlpha(newValue);
          },
        },
      }),

      Atmosphere: folder({
        "Day color": {
          value: "#" + uEarthAtmosphereDayColor.getHexString(),
          onChange: (newValue) => {
            setUEarthAtmosphereDayColor(new THREE.Color(newValue));
          },
        },
        "Twilight color": {
          value: "#" + uEarthAtmosphereTwilightColor.getHexString(),
          onChange: (newValue) => {
            setUEarthAtmosphereTwilightColor(new THREE.Color(newValue));
          },
        },
      }),

      "Specular reflection": folder({
        Intensity: {
          min: 1,
          value: uEarthSpecularIntensity,
          max: 100,
          onChange: (newValue) => {
            setUEarthSpecularIntensity(newValue);
          },
        },
        Opacity: {
          min: 0,
          value: uEarthSpecularOpacity,
          max: 1,
          onChange: (newValue) => {
            setUEarthSpecularOpacity(newValue);
          },
        },
        Color: {
          value: "#" + uEarthSpecularColor.getHexString(),
          onChange: (newValue) => {
            setUEarthSpecularColor(new THREE.Color(newValue));
          },
        },
      }),
    },
    { collapsed: true, color: "#42f876" }
  );

  return controls;
}

export default useEarthDebugControls;
