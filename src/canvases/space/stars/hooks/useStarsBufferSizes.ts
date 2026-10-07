import { useMemo } from "react";

function useStarsBufferSizes(starsCount: number) {
  return useMemo(() => {
    const bufferSizes = new Float32Array(starsCount);

    for (let i = 0; i < starsCount; i++) {
      bufferSizes[i] = Math.random() + 0.5;
    }

    return bufferSizes;
  }, [starsCount]);
}

export default useStarsBufferSizes;
