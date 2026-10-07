import { useMemo } from "react";
import * as THREE from "three";

// Random, evenly distributed points on a unit sphere (computed once, so the stars never jump around on re-renders)
function useStarsBufferPositions(starsCount: number) {
  return useMemo(() => {
    const bufferPositions = new Float32Array(starsCount * 3);
    const spherical = new THREE.Spherical(1);
    const starPosition = new THREE.Vector3();

    for (let i = 0; i < starsCount; i++) {
      spherical.phi = Math.acos(1 - 2 * Math.random());
      spherical.theta = 2 * Math.PI * Math.random();
      starPosition.setFromSpherical(spherical);
      starPosition.toArray(bufferPositions, i * 3);
    }

    return bufferPositions;
  }, [starsCount]);
}

export default useStarsBufferPositions;
