import * as THREE from "three";

import { useSpaceContext } from "@/canvases/space/contexts/SpaceContext";
import { folder, useDebugControls as useControls } from "@/lib/debug";

function useJupiterDebugControls() {
  const {
    uniforms: {
      uJupiterAtmosphereDayColor,
      setUJupiterAtmosphereDayColor,
      uJupiterAtmosphereTwilightColor,
      setUJupiterAtmosphereTwilightColor,
    },
  } = useSpaceContext();

  const controls = useControls(
    "Jupiter 🟠",
    {
      Position: folder({
        "Spherical phi value": {
          min: 0,
          value: Math.PI * 0.5,
          max: Math.PI,
        },

        "Spherical theta value": {
          min: -Math.PI,
          value: -2.83,
          max: Math.PI,
        },
      }),

      Atmosphere: folder({
        "Day color": {
          value: "#" + uJupiterAtmosphereDayColor.getHexString(),
          onChange: (newValue) => {
            setUJupiterAtmosphereDayColor(new THREE.Color(newValue));
          },
        },
        "Twilight color": {
          value: "#" + uJupiterAtmosphereTwilightColor.getHexString(),
          onChange: (newValue) => {
            setUJupiterAtmosphereTwilightColor(new THREE.Color(newValue));
          },
        },
      }),
    },
    { collapsed: true, color: "#e5b61e" }
  );

  return controls;
}

export default useJupiterDebugControls;
