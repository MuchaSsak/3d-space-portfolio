import { useLingui } from "@lingui/react/macro";
import gsap from "gsap";
import { useEffect, useState } from "react";

import { useSettingsContext } from "@/contexts/SettingsContext";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";

const staticDocumentTitle = "Mateusz Muszarski | 3D Space Portfolio";

type TitleStatus = "loading" | "ready" | "active";

function AnimateDocumentTitle() {
  const { t } = useLingui();
  const [titleStatus, setTitleStatus] = useState<TitleStatus>("loading");
  const { hasLoaded, hasStartedExperience } = useSettingsContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Update title status
  useEffect(() => {
    if (hasStartedExperience) return setTitleStatus("active");
    if (hasLoaded) return setTitleStatus("ready");
  }, [hasLoaded, hasStartedExperience]);

  // Update document title
  useEffect(() => {
    // An animated title is distracting for people who prefer reduced motion
    if (prefersReducedMotion) {
      document.title = staticDocumentTitle;
      return;
    }

    let loadingTimeline: gsap.core.Tween;
    let readyTimeline: gsap.core.Tween;
    let activeTimeline: gsap.core.Tween;

    switch (titleStatus) {
      case "loading": {
        const titles = [t`Deploying...`, t`Deploying....`, t`Deploying.....`];
        const progress = { value: 0 };

        loadingTimeline = gsap.to(progress, {
          value: titles.length - 1,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "none",

          onUpdate: () => {
            const i = Math.round(progress.value);
            document.title = titles[i];
          },
        });

        break;
      }

      case "ready": {
        const titles = [
          `🔴 Ready for launch! 🔴`,
          "Mateusz Muszarski | Portfolio",
        ];
        const progress = { value: 0 };

        readyTimeline = gsap.to(progress, {
          value: titles.length - 1,
          duration: 5,
          repeat: -1,
          ease: "none",

          onUpdate: () => {
            const i = Math.round(progress.value);
            document.title = titles[i];
          },
        });
        break;
      }

      case "active": {
        const titles = [
          "🚀_______________",
          "_🚀______________",
          "__🚀_____________",
          "___🚀____________",
          "____🚀___________",
          "_____🚀__________",
          "______🚀_________",
          "_______🚀________",
          "________🚀_______",
          "_________🚀______",
          "__________🚀_____",
          "___________🚀____",
          "____________🚀___",
          "_____________🚀__",
          "______________🚀_",
          "_______________🚀",
          "🚀_______________",
        ];
        const progress = { value: 0 };

        activeTimeline = gsap.to(progress, {
          value: titles.length - 1,
          duration: titles.length,
          repeat: -1,
          ease: "none",
          delay: 2,

          onUpdate: () => {
            const i = Math.round(progress.value);
            document.title = titles[i];
          },
        });
        break;
      }
    }

    return () => {
      loadingTimeline?.kill();
      readyTimeline?.kill();
      activeTimeline?.kill();
    };
  }, [titleStatus, t, prefersReducedMotion]);

  return null;
}

export default AnimateDocumentTitle;
