import { useLingui } from "@lingui/react/macro";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import { useScrollContext } from "@/contexts/ScrollContext";
import {
  heroMyOriginScrollProgress,
  jobExperienceTitleScrollProgress,
} from "@/lib/sections";

function JobExperienceTitle() {
  const { t } = useLingui();
  const { previousScrollProgress, scrollProgress } = useScrollContext();

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register } = useAnimateObjectVisibility({
    visibleRange: [
      jobExperienceTitleScrollProgress,
      jobExperienceTitleScrollProgress,
    ],
    showOptions: {
      duration: previousScrollProgress === heroMyOriginScrollProgress ? 0.5 : 1,
    },
  });

  return (
    <SceneHtml
      className="select-none pointer-events-none"
      center
      position={[9.85, 2.25, -90]}
      isActive={scrollProgress === jobExperienceTitleScrollProgress}
    >
      {/* Title */}
      <h2
        ref={register}
        className="w-max text-red-gradient text-center opacity-0 text-6xl flex items-center gap-2 font-bold pb-1"
      >
        <span>{t`Job Experience`}</span>
      </h2>
    </SceneHtml>
  );
}

export default JobExperienceTitle;
