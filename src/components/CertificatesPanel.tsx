import { useLingui } from "@lingui/react/macro";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import CertificatesItemCard from "@/canvases/space/sections/certificatesSection/components/CertificatesItemCard";
import { Button } from "@/components/ui/button";
import { useScrollContext } from "@/contexts/ScrollContext";
import { CERTIFICATES_LIST } from "@/lib/constants";
import { certificatesListScrollProgress } from "@/lib/sections";
import { cn } from "@/lib/utils";

const relevantCertificates = CERTIFICATES_LIST.filter(
  (certificate) => certificate.isRelevant
);
const lessRelevantCertificates = CERTIFICATES_LIST.filter(
  (certificate) => !certificate.isRelevant
);

/**
 * Scrollable list of certificates shown next to Jupiter. It's a regular DOM overlay, so it scrolls natively (wheel, touch, keyboard)
 */
function CertificatesPanel() {
  const { t } = useLingui();
  const { scrollProgress, registerScrollInterceptor } = useScrollContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [hasExpandedLessRelevant, setHasExpandedLessRelevant] = useState(false);
  const isActive = scrollProgress === certificatesListScrollProgress;

  // Fade in once the camera arrives, fade out right away when leaving
  useEffect(() => {
    const scrollAreaEl = scrollAreaRef.current;
    if (!scrollAreaEl) return;

    if (isActive) scrollAreaEl.scrollTo({ top: 0 });
    const tween = gsap.to(scrollAreaEl, {
      opacity: isActive ? 1 : 0,
      delay: isActive ? 1 : 0,
      duration: isActive ? 1 : 0.5,
    });

    return () => {
      tween.kill();
    };
  }, [isActive]);

  // Keyboard and button navigation scroll through the list before moving on to the next section
  useEffect(
    () =>
      registerScrollInterceptor(
        certificatesListScrollProgress,
        (direction, { source, axis }) => {
          const scrollAreaEl = scrollAreaRef.current;
          if (!scrollAreaEl || axis !== "vertical" || source === "touch")
            return false;

          const maxScrollTop =
            scrollAreaEl.scrollHeight - scrollAreaEl.clientHeight;
          const canScroll =
            direction > 0
              ? scrollAreaEl.scrollTop < maxScrollTop - 1
              : scrollAreaEl.scrollTop > 1;
          if (!canScroll) return false;

          scrollAreaEl.scrollBy({
            top: direction * scrollAreaEl.clientHeight * 0.6,
            behavior: "smooth",
          });
          return true;
        }
      ),
    [registerScrollInterceptor]
  );

  function handleToggleExpandLessRelevant() {
    setHasExpandedLessRelevant((isExpanded) => !isExpanded);
  }

  return (
    <div
      ref={scrollAreaRef}
      data-scroll-area
      inert={!isActive}
      aria-hidden={isActive ? undefined : true}
      className={cn(
        "fixed inset-0 z-[25] overflow-y-auto overflow-x-hidden scrollbar-hidden opacity-0 overscroll-contain",
        isActive ? "pointer-events-auto" : "pointer-events-none select-none"
      )}
    >
      <section
        aria-labelledby="certificates-panel-title"
        className="ml-auto mr-[max(1rem,calc(40vw-26rem))] short:mr-[max(1rem,calc(40vw-22rem))] w-[26rem] short:w-[22rem] max-w-[calc(100vw-2rem)] flex flex-col gap-4 short:gap-3 pt-[max(6rem,30vh)] short:pt-16 pb-[max(6rem,35vh)] short:pb-24"
      >
        <h2
          id="certificates-panel-title"
          className="text-amber-gradient text-3xl short:text-2xl font-bold"
        >
          {t`Certificates and courses`}
        </h2>

        <ul className="flex flex-col gap-4">
          {relevantCertificates.map((certificate, i) => (
            <CertificatesItemCard certificateData={certificate} key={i} />
          ))}
          {hasExpandedLessRelevant &&
            lessRelevantCertificates.map((certificate, i) => (
              <CertificatesItemCard
                certificateData={certificate}
                key={`less-relevant-${i}`}
              />
            ))}
        </ul>

        <Button
          className="text-muted-foreground self-center"
          size="sm"
          onClick={handleToggleExpandLessRelevant}
          variant="ghost"
          aria-expanded={hasExpandedLessRelevant}
        >
          {hasExpandedLessRelevant
            ? t`Show less`
            : t`Show more, less relevant certificates`}
        </Button>

        <p className="text-xs text-muted-foreground text-center pt-2">
          {t`Scroll past the end of the list to fly on to the projects`}
        </p>
      </section>
    </div>
  );
}

export default CertificatesPanel;
