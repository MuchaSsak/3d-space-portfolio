import { t } from "@lingui/core/macro";

/**
 * Every camera stop of the experience, in scroll order
 */
export const heroWelcomeTextScrollProgress = 0;
export const heroWelcomeTextCloseupScrollProgress = 1;
export const heroAboutMeScrollProgress = 2;
export const heroMyOriginScrollProgress = 3;
export const jobExperienceTitleScrollProgress = 4;
export const jobExperienceListScrollProgress = 5;
export const jobExperienceDownloadResumeScrollProgress = 6;
export const certificatesTitleScrollProgress = 7;
export const certificatesListScrollProgress = 8;
export const projectsTitleScrollProgress = 9;
export const projectsListScrollProgress = 10;
export const contactFormScrollProgress = 11;

// Accent color of every camera stop (used by the progress indicator)
export const AVAILABLE_SCROLLING_SECTIONS = [
  "#42f876",
  "#42f876",
  "#42f876",
  "#42f876",
  "#e56d1e",
  "#e56d1e",
  "#e56d1e",
  "#e5b61e",
  "#e5b61e",
  "#ffea80",
  "#ffea80",
  "#5468ff",
];

export const MIN_SCROLL_PROGRESS = 0;
export const MAX_SCROLL_PROGRESS = AVAILABLE_SCROLLING_SECTIONS.length - 1;

/**
 * Labeled chapters shown in the section navigation. Every chapter is one planet
 */
export type NavigationChapter = {
  id: string;
  Label: () => string;
  Planet: () => string;
  color: string;
  // Scroll progress the chapter jumps to
  target: number;
  // Inclusive range of scroll progresses that belong to the chapter
  range: [number, number];
};

export const NAVIGATION_CHAPTERS: NavigationChapter[] = [
  {
    id: "about",
    Label: () => t`About`,
    Planet: () => t`Earth`,
    color: "#42f876",
    target: heroAboutMeScrollProgress,
    range: [heroWelcomeTextScrollProgress, heroMyOriginScrollProgress],
  },
  {
    id: "experience",
    Label: () => t`Experience`,
    Planet: () => t`Mars`,
    color: "#e56d1e",
    target: jobExperienceListScrollProgress,
    range: [
      jobExperienceTitleScrollProgress,
      jobExperienceDownloadResumeScrollProgress,
    ],
  },
  {
    id: "certificates",
    Label: () => t`Certificates`,
    Planet: () => t`Jupiter`,
    color: "#e5b61e",
    target: certificatesListScrollProgress,
    range: [certificatesTitleScrollProgress, certificatesListScrollProgress],
  },
  {
    id: "projects",
    Label: () => t`Projects`,
    Planet: () => t`Saturn`,
    color: "#ffea80",
    target: projectsListScrollProgress,
    range: [projectsTitleScrollProgress, projectsListScrollProgress],
  },
  {
    id: "contact",
    Label: () => t`Contact`,
    Planet: () => t`Neptune`,
    color: "#5468ff",
    target: contactFormScrollProgress,
    range: [contactFormScrollProgress, contactFormScrollProgress],
  },
];

export function getChapterOfScrollProgress(scrollProgress: number) {
  return (
    NAVIGATION_CHAPTERS.find(
      ({ range }) => scrollProgress >= range[0] && scrollProgress <= range[1]
    ) ?? NAVIGATION_CHAPTERS[0]
  );
}
