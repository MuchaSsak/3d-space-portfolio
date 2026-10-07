import { useLingui } from "@lingui/react/macro";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import { useScrollContext } from "@/contexts/ScrollContext";
import { projectsTitleScrollProgress } from "@/lib/sections";

function ProjectsTitle() {
  const { t } = useLingui();
  const { scrollProgress } = useScrollContext();

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register } = useAnimateObjectVisibility({
    visibleRange: [projectsTitleScrollProgress, projectsTitleScrollProgress],
  });

  return (
    <SceneHtml
      className="select-none pointer-events-none"
      center
      position={[-743, -18, 1400]}
      isActive={scrollProgress === projectsTitleScrollProgress}
    >
      {/* Title */}
      <h2
        ref={register}
        className="w-max text-yellow-gradient text-center opacity-0 text-8xl flex items-center gap-2 font-bold pb-2"
      >
        <span>{t`Projects`}</span>
      </h2>
    </SceneHtml>
  );
}

export default ProjectsTitle;
