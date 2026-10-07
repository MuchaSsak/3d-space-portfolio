import { useLingui } from "@lingui/react/macro";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import { Instagram } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useScrollContext } from "@/contexts/ScrollContext";
import { INSTAGRAM_LINK } from "@/lib/constants";
import { heroMyOriginScrollProgress } from "@/lib/sections";

const COUNTRIES_VISITED_EMOJIS = [
  "🇱🇹",
  "🇱🇻",
  "🇬🇪",
  "🇬🇷",
  "🇬🇧",
  "🇹🇷",
  "🇳🇱",
];

function HeroMyOrigin() {
  const { t } = useLingui();
  const { scrollProgress } = useScrollContext();
  const isActive = scrollProgress === heroMyOriginScrollProgress;

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register } = useAnimateObjectVisibility({
    visibleRange: [heroMyOriginScrollProgress, heroMyOriginScrollProgress],
  });

  return (
    <SceneHtml
      className="select-none flex flex-col items-center"
      center
      position={[0.2, -0.05, -16.26]}
      isActive={isActive}
    >
      {/* Title */}
      <h2
        ref={register}
        className="text-center text-gold-gradient opacity-0 text-4xl flex items-center gap-2 font-bold"
      >
        <span>{t`I originate from Poland`}</span>
        <span className="font-emoji text-foreground text-2xl" aria-hidden>
          🇵🇱
        </span>
      </h2>

      {/* Availability subtitle */}
      <p
        ref={register}
        className="opacity-0 text-center text-foreground/90 text-lg font-medium pt-2 [text-shadow:0_2px_10px_rgb(0_0_0/0.8)]"
      >
        {t`Open to full-time and contract roles, remote or hybrid (CET). I work in English and Polish.`}
      </p>

      {/* Other countries subtitle */}
      <p
        ref={register}
        className="font-semibold text-gold-gradient text-2xl opacity-0 leading-7 tracking-[-0.0125em] py-4 text-center flex flex-col items-center"
      >
        <span>{t`But I've been to a bunch of`}</span>
        {/* Other countries tooltip */}
        <Tooltip>
          <TooltipTrigger className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-[#ffde8c]/50">
            <span className="underline font-bold cursor-default text-[#DEC27C] hover:text-[#ffde8c] transition-colors underline-offset-2">
              {t`other countries too!`}
            </span>
          </TooltipTrigger>
          <TooltipContent
            className="text-2xl flex flex-wrap max-w-72 justify-center gap-3"
            sideOffset={6}
            side="bottom"
          >
            {COUNTRIES_VISITED_EMOJIS.map((country) => (
              <span key={country} className="font-emoji">
                {country}
              </span>
            ))}
          </TooltipContent>
        </Tooltip>
      </p>

      {/* Instagram subtitle */}
      <p
        ref={register}
        className="font-semibold text-gold-gradient opacity-0 text-2xl leading-7 tracking-[-0.0125em] w-[28rem] text-center"
      >
        <span>{t`Check out my `}</span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={INSTAGRAM_LINK}
          className="font-bold inline-flex gap-1 hover:text-[#ffde8c] focus-visible:text-[#ffde8c] transition-colors translate-y-[0.185rem] items-center text-[#DEC27C] underline rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-[#ffde8c]/50"
        >
          <Instagram aria-hidden />
          {t`Instagram`}
        </a>
        <span>{t` for amateur photography of those places `}</span>
        <span className="font-emoji text-white" aria-hidden>
          😉
        </span>
      </p>
    </SceneHtml>
  );
}

export default HeroMyOrigin;
