import { useLingui } from "@lingui/react/macro";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRef, useState } from "react";

import { RotateCwIcon, XIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import useMediaQuery from "@/hooks/useMediaQuery";
import { getWebsiteLink } from "@/lib/constants";

const smallScreenQuery = "(max-width: 899px), (max-height: 499px)";
const portraitQuery = "(orientation: portrait) and (max-width: 899px)";

/**
 * Heads-up for phones and small screens: the experience works there (best in landscape), but the main portfolio is lighter
 */
function MobileWarning() {
  const { t } = useLingui();
  const { language } = useLanguage();
  const { dispatch, hasIgnoredMobileWarning, hasLoaded } = useSettingsContext();
  const isSmallScreen = useMediaQuery(smallScreenQuery);
  const isPortrait = useMediaQuery(portraitQuery);
  const [hasDismissedPortraitTip, setHasDismissedPortraitTip] = useState(false);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const isNoticeShown = hasLoaded && isSmallScreen && !hasIgnoredMobileWarning;

  function handleIgnoreWarning() {
    dispatch({ type: "experience/ignoreMobileWarning" });
    dispatch({ type: "state/save" });
  }

  // Small reminder for people who continued in portrait
  if (!isNoticeShown) {
    if (!isPortrait || hasDismissedPortraitTip || !hasIgnoredMobileWarning)
      return null;

    return (
      <div
        role="status"
        className="fixed left-1/2 -translate-x-1/2 top-[max(3.5rem,calc(env(safe-area-inset-top)+3rem))] z-[45] flex items-center gap-2 rounded-full border border-foreground/15 bg-background/80 backdrop-blur-md pl-4 pr-1 py-1 text-xs shadow-lg w-max max-w-[calc(100vw-1rem)]"
      >
        <RotateCwIcon className="size-4 shrink-0" aria-hidden />
        <span>{t`Rotate your phone for the best view`}</span>
        <button
          type="button"
          onClick={() => setHasDismissedPortraitTip(true)}
          className="grid place-items-center size-7 rounded-full hover:bg-foreground/10 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          aria-label={t`Dismiss`}
        >
          <XIcon className="size-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <DialogPrimitive.Root open>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          data-blocking-overlay
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            continueButtonRef.current?.focus();
          }}
          // Escape means "continue", clicking outside does nothing
          onEscapeKeyDown={handleIgnoreWarning}
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed inset-0 z-[90] bg-background/75 backdrop-blur-md flex justify-center items-center overflow-y-auto p-4 text-center outline-none"
        >
          <div className="flex flex-col items-center gap-4 max-w-md py-6">
            <span className="font-emoji text-6xl" aria-hidden>
              {isPortrait ? "📱" : "🚀"}
            </span>
            <DialogPrimitive.Title className="text-3xl font-black">
              {t`Heads up!`}
            </DialogPrimitive.Title>

            <DialogPrimitive.Description asChild>
              <div className="flex flex-col gap-2 text-sm text-card-foreground/85 text-balance">
                <p>{t`This is a heavy 3D experience made for bigger screens. It works on phones too, but it's best on a computer.`}</p>
                {isPortrait && (
                  <p className="flex items-center justify-center gap-2 font-medium text-foreground">
                    <RotateCwIcon className="size-4 shrink-0" aria-hidden />
                    {t`Turn your phone sideways for the best view.`}
                  </p>
                )}
                <p>{t`Just want to see my work quickly? My main portfolio is fast and made for every screen.`}</p>
              </div>
            </DialogPrimitive.Description>

            <div className="flex flex-col xs:flex-row gap-2 w-full justify-center pt-2">
              <Button asChild size="lg" className="text-base">
                <a href={getWebsiteLink(language)}>{t`Open the main portfolio`}</a>
              </Button>
              <Button
                ref={continueButtonRef}
                variant="outline"
                size="lg"
                className="text-base"
                onClick={handleIgnoreWarning}
              >
                {t`Continue to the 3D version`}
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default MobileWarning;
