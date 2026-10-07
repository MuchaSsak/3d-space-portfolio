import { useLayoutEffect } from "react";

import { useSpaceContext } from "@/canvases/space/contexts/SpaceContext";

// Copies the shared uniforms onto a shader material (before the next frame is rendered)
function useUpdateShaderUniforms(shaderMaterialRef: React.RefObject<any>) {
  const { uniforms } = useSpaceContext();

  useLayoutEffect(() => {
    if (!shaderMaterialRef.current) return;

    for (const [key, value] of Object.entries(uniforms)) {
      // Skip the state setters that live next to the uniforms
      if (typeof value === "function") continue;
      shaderMaterialRef.current[key] = value;
    }
  }, [shaderMaterialRef, uniforms]);
}

export default useUpdateShaderUniforms;
