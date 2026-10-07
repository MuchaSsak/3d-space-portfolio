import { useLingui } from "@lingui/react/macro";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import { DownloadIcon, Linkedin } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollContext } from "@/contexts/ScrollContext";
import { getResumeLink, LINKEDIN_LINK } from "@/lib/constants";
import { jobExperienceDownloadResumeScrollProgress } from "@/lib/sections";

function JobExperienceDownloadResume() {
  const { t } = useLingui();
  const { language } = useLanguage();
  const { scrollProgress } = useScrollContext();
  const isActive = scrollProgress === jobExperienceDownloadResumeScrollProgress;

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register, isRendered } = useAnimateObjectVisibility({
    visibleRange: [
      jobExperienceDownloadResumeScrollProgress,
      jobExperienceDownloadResumeScrollProgress,
    ],
    renderedRange: [
      jobExperienceDownloadResumeScrollProgress,
      jobExperienceDownloadResumeScrollProgress,
    ],
  });
  if (!isRendered) return null;

  return (
    <SceneHtml center position={[3, 0, -80]} isActive={isActive}>
      <div className="flex flex-col gap-4 w-90">
        {/* Download resume */}
        <Button
          asChild
          variant="outline"
          className="opacity-0 text-2xl h-auto py-4 px-10 bg-foreground/25! w-full border-foreground/40! hover:bg-foreground/40! focus-visible:bg-foreground/40! border-2 [&_svg]:size-6!"
        >
          <a
            ref={register}
            href={getResumeLink(language)}
            target="_blank"
            rel="noopener"
            download
          >
            {t`Download CV`}
            <DownloadIcon aria-hidden />
            <span className="sr-only">{t`(PDF)`}</span>
          </a>
        </Button>

        {/* Or separator */}
        <div
          ref={register}
          className="opacity-0 flex items-center gap-5 text-foreground/50"
          aria-hidden
        >
          <hr className="bg-foreground/50 flex-grow" />
          <span>{t`OR`}</span>
          <hr className="bg-foreground/50 flex-grow" />
        </div>

        {/* Visit Linkedin */}
        <Button
          asChild
          variant="outline"
          className="opacity-0 text-2xl h-auto py-4 px-10 w-full border-background/30! bg-blue-600/85! hover:bg-blue-600! focus-visible:bg-blue-600! border-2"
        >
          <a
            ref={register}
            href={LINKEDIN_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t`Visit LinkedIn`}
            <Linkedin className="size-6 fill-foreground stroke-[0.5] bg-blue-700 p-[3px] rounded-sm" />
            <span className="sr-only">{t`(opens in a new tab)`}</span>
          </a>
        </Button>
      </div>
    </SceneHtml>
  );
}

export default JobExperienceDownloadResume;
