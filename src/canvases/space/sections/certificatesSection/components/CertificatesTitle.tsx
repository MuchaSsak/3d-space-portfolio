import { useLingui } from "@lingui/react/macro";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import { useScrollContext } from "@/contexts/ScrollContext";
import { certificatesTitleScrollProgress } from "@/lib/sections";

function CertificatesTitle() {
  const { t } = useLingui();
  const { scrollProgress } = useScrollContext();

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register } = useAnimateObjectVisibility({
    visibleRange: [
      certificatesTitleScrollProgress,
      certificatesTitleScrollProgress,
    ],
  });

  return (
    <SceneHtml
      className="select-none pointer-events-none"
      position={[-140, 7, -600]}
      isActive={scrollProgress === certificatesTitleScrollProgress}
    >
      {/* Title */}
      <h2
        ref={register}
        className="w-max text-amber-gradient text-center opacity-0 text-7xl flex items-center gap-2 font-bold pb-2"
      >
        <span>{t`Certificates`}</span>
      </h2>
    </SceneHtml>
  );
}

export default CertificatesTitle;
