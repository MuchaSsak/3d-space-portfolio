import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";

// The experience was composed for a 16:9 screen with a vertical field of view of 45°
const baseVerticalFov = 45;
const baseAspectRatio = 16 / 9;
const baseViewportHeight = 1080;
// Wider than this gets too distorted
const maxVerticalFov = 95;
const minSceneScale = 0.55;
const maxSceneScale = 1.4;
// Text shrinks a bit slower than the 3D scene, so it stays readable on small screens
const sceneScaleDamping = 0.75;

function getPixelsPerWorldUnitFactor(viewportHeight: number, verticalFov: number) {
  return viewportHeight / Math.tan(THREE.MathUtils.degToRad(verticalFov / 2));
}

const basePixelsPerWorldUnitFactor = getPixelsPerWorldUnitFactor(
  baseViewportHeight,
  baseVerticalFov
);

/**
 * Narrow screens (portrait phones, 4:3 tablets) get a wider vertical field of view, so the horizontal one matches the original composition.
 * Text anchored in the scene is scaled with the same factor as the 3D objects through the --scene-scale CSS variable.
 */
function ResponsiveCamera() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    if (!size.width || !size.height) return;

    const aspectRatio = size.width / size.height;
    let verticalFov = baseVerticalFov;

    if (aspectRatio < baseAspectRatio) {
      const baseHorizontalHalfFovTangent =
        Math.tan(THREE.MathUtils.degToRad(baseVerticalFov / 2)) *
        baseAspectRatio;
      verticalFov = Math.min(
        maxVerticalFov,
        THREE.MathUtils.radToDeg(
          2 * Math.atan(baseHorizontalHalfFovTangent / aspectRatio)
        )
      );
    }

    camera.fov = verticalFov;
    camera.updateProjectionMatrix();

    const sceneScale = THREE.MathUtils.clamp(
      Math.pow(
        getPixelsPerWorldUnitFactor(size.height, verticalFov) /
          basePixelsPerWorldUnitFactor,
        sceneScaleDamping
      ),
      minSceneScale,
      maxSceneScale
    );
    document.documentElement.style.setProperty(
      "--scene-scale",
      sceneScale.toFixed(3)
    );
  }, [camera, size.width, size.height]);

  return null;
}

export default ResponsiveCamera;
