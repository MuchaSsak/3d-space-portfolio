import * as THREE from "three";

import { useSpaceContext } from "@/canvases/space/contexts/SpaceContext";
import { folder, useDebugControls as useControls } from "@/lib/debug";

function useSaturnDebugControls() {
  const {
    uniforms: {
      uSaturnAtmosphereDayColor,
      setUSaturnAtmosphereDayColor,
      uSaturnAtmosphereTwilightColor,
      setUSaturnAtmosphereTwilightColor,
    },
  } = useSpaceContext();

  const controls = useControls(
    "Saturn 🪐",
    {
      Position: folder({
        "Spherical phi value": {
          min: 0,
          value: Math.PI * 0.5,
          max: Math.PI,
        },

        "Spherical theta value": {
          min: -Math.PI,
          value: -0.44,
          max: Math.PI,
        },
      }),

      Atmosphere: folder({
        "Day color": {
          value: "#" + uSaturnAtmosphereDayColor.getHexString(),
          onChange: (newValue) => {
            setUSaturnAtmosphereDayColor(new THREE.Color(newValue));
          },
        },
        "Twilight color": {
          value: "#" + uSaturnAtmosphereTwilightColor.getHexString(),
          onChange: (newValue) => {
            setUSaturnAtmosphereTwilightColor(new THREE.Color(newValue));
          },
        },
      }),
    },
    { collapsed: true, color: "#ffc66a" }
  );

  return controls;
}

export default useSaturnDebugControls;
