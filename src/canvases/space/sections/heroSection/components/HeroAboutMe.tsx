import { useLingui } from "@lingui/react/macro";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import { useScrollContext } from "@/contexts/ScrollContext";
import { heroAboutMeScrollProgress } from "@/lib/sections";

function HeroAboutMe() {
  const { t } = useLingui();
  const { scrollProgress } = useScrollContext();

  const { register } = useAnimateObjectVisibility({
    visibleRange: [heroAboutMeScrollProgress, heroAboutMeScrollProgress],
  });

  return (
    <SceneHtml
      className="select-none pointer-events-none"
      position={[1, 3, -16]}
      isActive={scrollProgress === heroAboutMeScrollProgress}
    >
      {/* Title */}
      <h2
        ref={register}
        className="opacity-0 text-gold-gradient text-6xl font-bold pb-4"
      >
        {t`About me `}
        <span className="font-emoji text-foreground" aria-hidden>
          👋
        </span>
      </h2>

      {/* Description */}
      <div
        ref={register}
        className="opacity-0 text-gold-gradient text-xl font-semibold w-sm flex flex-col gap-4"
      >
        <p>
          {t`I'm Mateusz Muszarski, a full-stack developer from Poland. Code is the tool: I build products that solve real business problems, at a cost that makes sense. `}
          <span className="font-emoji text-foreground" aria-hidden>
            🚀
          </span>
        </p>
        <p>
          {t`I build web and mobile apps end to end in TypeScript, React, Next.js, React Native and Supabase, and I shipped my own app solo to the App Store and Google Play. `}
          <span className="font-emoji text-foreground" aria-hidden>
            📱
          </span>
        </p>
        <p>
          {t`Beyond code, I enjoy calisthenics, travelling, motorcycles, films and gaming with friends! `}
          <span className="font-emoji text-foreground" aria-hidden>
            ✨
          </span>
        </p>
      </div>
    </SceneHtml>
  );
}

export default HeroAboutMe;
