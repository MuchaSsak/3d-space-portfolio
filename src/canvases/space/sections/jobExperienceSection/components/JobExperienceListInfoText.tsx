import { useLingui } from "@lingui/react/macro";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import { useScrollContext } from "@/contexts/ScrollContext";
import {
  jobExperienceListScrollProgress,
  jobExperienceTitleScrollProgress,
} from "@/lib/sections";

function JobExperienceListInfoText() {
  const { t } = useLingui();
  const { previousScrollProgress } = useScrollContext();

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register } = useAnimateObjectVisibility({
    visibleRange: [
      jobExperienceListScrollProgress,
      jobExperienceListScrollProgress,
    ],
    showOptions: {
      delay:
        previousScrollProgress === jobExperienceTitleScrollProgress ? 2 : 0,
    },
  });

  return (
    <SceneHtml
      className="select-none pointer-events-none"
      center
      position={[9.95, -3.25, -90]}
      isActive={false}
    >
      {/* Title */}
      <h3
        ref={register}
        className="w-max text-gold-gradient text-center opacity-0 text-xl flex items-center gap-2 font-bold"
      >
        {t`Click an asteroid for more details`}
      </h3>
    </SceneHtml>
  );
}

export default JobExperienceListInfoText;
