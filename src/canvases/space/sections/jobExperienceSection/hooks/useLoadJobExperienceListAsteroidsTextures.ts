import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

import { useSettingsContext } from "@/contexts/SettingsContext";
import { JOB_EXPERIENCE_LIST, type JobExperienceId } from "@/lib/constants";

const jobExperienceIds = Object.keys(JOB_EXPERIENCE_LIST) as JobExperienceId[];
const logoUrls = jobExperienceIds.map((id) => JOB_EXPERIENCE_LIST[id].logoImgSrc);

function useLoadJobExperienceListAsteroidsTextures() {
  const { anisotropy } = useSettingsContext();

  const loadedTextures = useTexture(logoUrls);

  const textures = useMemo(() => {
    const texturesById = {} as Record<JobExperienceId, THREE.Texture>;

    loadedTextures.forEach((texture, i) => {
      // Change colorSpace for diffuse textures
      texture.colorSpace = THREE.SRGBColorSpace;
      // Change anisotropy according to the settings
      texture.anisotropy = anisotropy;
      // Update the texture
      texture.needsUpdate = true;

      texturesById[jobExperienceIds[i]] = texture;
    });

    return texturesById;
  }, [loadedTextures, anisotropy]);

  return textures;
}

export default useLoadJobExperienceListAsteroidsTextures;
