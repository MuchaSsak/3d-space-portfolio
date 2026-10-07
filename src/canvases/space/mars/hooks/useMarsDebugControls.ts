import * as THREE from "three";

import { useSpaceContext } from "@/canvases/space/contexts/SpaceContext";
import { folder, useDebugControls as useControls } from "@/lib/debug";

function useMarsDebugControls() {
  const {
    uniforms: {
      uMarsAtmosphereDayColor,
      setUMarsAtmosphereDayColor,
      uMarsAtmosphereTwilightColor,
      setUMarsAtmosphereTwilightColor,
    },
  } = useSpaceContext();

  const controls = useControls(
    "Mars 🔴",
    {
      Position: folder({
        "Spherical phi value": {
          min: 0,
          value: Math.PI * 0.5,
          max: Math.PI,
        },

        "Spherical theta value": {
          min: -Math.PI,
          value: 3.0325,
          max: Math.PI,
        },
      }),

      Atmosphere: folder({
        "Day color": {
          value: "#" + uMarsAtmosphereDayColor.getHexString(),
          onChange: (newValue) => {
            setUMarsAtmosphereDayColor(new THREE.Color(newValue));
          },
        },
        "Twilight color": {
          value: "#" + uMarsAtmosphereTwilightColor.getHexString(),
          onChange: (newValue) => {
            setUMarsAtmosphereTwilightColor(new THREE.Color(newValue));
          },
        },
      }),
    },
    { collapsed: true, color: "#e56d1e" }
  );

  return controls;
}

export default useMarsDebugControls;
