import { useLingui } from "@lingui/react/macro";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import ScrollHint from "@/components/ScrollHint";
import { useProjectsCarousel } from "@/contexts/ProjectsCarouselContext";
import { useScrollContext } from "@/contexts/ScrollContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { PROJECTS_LIST } from "@/lib/constants";
import {
  AVAILABLE_SCROLLING_SECTIONS,
  getChapterOfScrollProgress,
  MAX_SCROLL_PROGRESS,
  NAVIGATION_CHAPTERS,
  projectsListScrollProgress,
} from "@/lib/sections";
import { cn } from "@/lib/utils";

const IDLE_HINT_DELAY_MS = 5000;

/**
 * Bottom navigation: labeled chapters (one per planet) that jump straight to their section, plus the progress of every camera stop
 */
function SectionNavigation() {
  const { t } = useLingui();
  const { scrollProgress, goToScrollProgress, isScrollingPaused } =
    useScrollContext();
  const { hasStartedExperience } = useSettingsContext();
  const {
    activeProjectIndex,
    projectsCount,
    showNextProject,
    showPreviousProject,
  } = useProjectsCarousel();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeChapter = getChapterOfScrollProgress(scrollProgress);
  const activeChapterIndex = NAVIGATION_CHAPTERS.indexOf(activeChapter);
  const isOnProjectsList = scrollProgress === projectsListScrollProgress;
  const activeProject = PROJECTS_LIST[activeProjectIndex];

  // Remind how to move on whenever the visitor has been idle for a while
  const [isIdle, setIsIdle] = useState(false);
  useEffect(() => {
    if (!hasStartedExperience) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const resetIdleTimer = (e?: Event) => {
      if (e?.target instanceof Element && e.target.closest("[data-scroll-hint]"))
        return;
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsIdle(true), IDLE_HINT_DELAY_MS);
    };

    // Mouse movement alone doesn't count, so a lost visitor jiggling the cursor still gets the hint
    const activityEvents = ["wheel", "keydown", "pointerdown", "touchstart"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetIdleTimer, { passive: true })
    );
    resetIdleTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
    };
    // Progressing (also via the navigation) counts as activity too
  }, [hasStartedExperience, scrollProgress]);
  const isScrollHintVisible =
    isIdle && !isScrollingPaused && scrollProgress < MAX_SCROLL_PROGRESS;

  // Fade in on start experience
  useEffect(() => {
    if (!hasStartedExperience) return;

    const tween = gsap.to(containerRef.current, {
      autoAlpha: 1,
      duration: 2,
      delay: 3.25,
    });

    return () => {
      tween.kill();
    };
  }, [hasStartedExperience]);

  return (
    <div
      ref={containerRef}
      data-scroll-progress={scrollProgress}
      className="fixed invisible opacity-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] short:bottom-[max(0.25rem,env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 flex flex-col items-center gap-2 short:gap-1 max-w-[calc(100vw-0.5rem)]"
    >
      {/* Scroll hint, shown while the visitor is idle */}
      <ScrollHint isVisible={isScrollHintVisible} />

      {/* Projects carousel controls */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-foreground/15 bg-background/60 backdrop-blur-md px-1.5 py-1 short:py-0.5 transition-[opacity,translate] duration-500",
          isOnProjectsList
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
        inert={!isOnProjectsList}
        aria-label={t`Projects`}
        role="group"
      >
        <button
          type="button"
          onClick={showPreviousProject}
          disabled={activeProjectIndex === 0}
          className="grid place-items-center size-8 short:size-7 rounded-full hover:bg-foreground/10 disabled:opacity-30 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          aria-label={t`Previous project`}
        >
          <ChevronLeftIcon className="size-5" aria-hidden />
        </button>
        <p
          className="text-sm short:text-xs tabular-nums min-w-[12rem] short:min-w-[9rem] max-w-[60vw] text-center truncate"
          aria-live="polite"
        >
          <span className="text-foreground/60">
            {activeProjectIndex + 1}/{projectsCount}
          </span>{" "}
          <span className="font-medium">{activeProject?.Title()}</span>
        </p>
        <button
          type="button"
          onClick={showNextProject}
          disabled={activeProjectIndex === projectsCount - 1}
          className="grid place-items-center size-8 short:size-7 rounded-full hover:bg-foreground/10 disabled:opacity-30 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          aria-label={t`Next project`}
        >
          <ChevronRightIcon className="size-5" aria-hidden />
        </button>
      </div>

      {/* Chapters */}
      <nav
        aria-label={t`Sections`}
        // Scrolling the chips sideways on narrow screens must not move the experience
        data-horizontal-scroll-area
        className="rounded-full border border-foreground/15 bg-background/55 backdrop-blur-md px-1.5 py-1 short:py-0.5 shadow-lg max-w-full overflow-x-auto scrollbar-hidden"
      >
        <ol className="flex items-stretch gap-0.5">
          {NAVIGATION_CHAPTERS.map((chapter, chapterIndex) => {
            const isActiveChapter = chapter === activeChapter;
            const isPassedChapter = chapterIndex < activeChapterIndex;
            const stops = AVAILABLE_SCROLLING_SECTIONS.slice(
              chapter.range[0],
              chapter.range[1] + 1
            );

            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => goToScrollProgress(chapter.target)}
                  aria-current={isActiveChapter ? "step" : undefined}
                  className={cn(
                    "group flex flex-col items-center gap-1 rounded-full px-2 sm:px-4 py-1.5 short:py-1 short:px-3 outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/60",
                    isActiveChapter
                      ? "bg-foreground/10"
                      : "hover:bg-foreground/5"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs sm:text-sm short:text-xs font-medium leading-none transition-colors whitespace-nowrap",
                      isActiveChapter
                        ? "text-foreground"
                        : "text-foreground/60 group-hover:text-foreground/90"
                    )}
                  >
                    <chapter.Label />
                  </span>

                  {/* Progress of the camera stops inside the chapter */}
                  <span className="flex items-center gap-0.5" aria-hidden>
                    {stops.map((color, stopIndex) => {
                      const stopScrollProgress = chapter.range[0] + stopIndex;
                      const isReached =
                        isPassedChapter ||
                        (isActiveChapter &&
                          stopScrollProgress <= scrollProgress);

                      return (
                        <span
                          key={stopScrollProgress}
                          style={{ backgroundColor: color }}
                          className={cn(
                            "rounded-full h-0.5 w-3 transition-opacity duration-500",
                            isReached ? "opacity-100" : "opacity-25"
                          )}
                        />
                      );
                    })}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Announce the current section to screen readers */}
      <p className="sr-only" aria-live="polite">
        {hasStartedExperience &&
          t`Section ${activeChapterIndex + 1} of ${NAVIGATION_CHAPTERS.length}: ${activeChapter.Label()}, planet ${activeChapter.Planet()}`}
      </p>
    </div>
  );
}

export default SectionNavigation;
