import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useScrollContext } from "@/contexts/ScrollContext";
import { PROJECTS_LIST } from "@/lib/constants";
import { projectsListScrollProgress } from "@/lib/sections";

// Input is ignored while the carousel rotates to the next card
const cardChangeLockMs = 550;

type ProjectsCarouselContext = {
  activeProjectIndex: number;
  projectsCount: number;
  showProject: (index: number) => void;
  showNextProject: () => boolean;
  showPreviousProject: () => boolean;
};

const ProjectsCarouselContext = createContext<ProjectsCarouselContext>({
  activeProjectIndex: 0,
  projectsCount: PROJECTS_LIST.length,
  showProject: () => {},
  showNextProject: () => false,
  showPreviousProject: () => false,
});
export { ProjectsCarouselContext };

export function ProjectsCarouselContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { scrollProgress, previousScrollProgress, registerScrollInterceptor } =
    useScrollContext();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProjectIndexRef = useRef(0);
  const lastChangeTimeRef = useRef(0);
  const projectsCount = PROJECTS_LIST.length;

  const showProject = useCallback(
    (index: number) => {
      const clampedIndex = Math.min(projectsCount - 1, Math.max(0, index));
      activeProjectIndexRef.current = clampedIndex;
      lastChangeTimeRef.current = performance.now();
      setActiveProjectIndex(clampedIndex);
    },
    [projectsCount]
  );

  const showProjectBy = useCallback(
    (direction: 1 | -1) => {
      const nextIndex = activeProjectIndexRef.current + direction;
      if (nextIndex < 0 || nextIndex >= projectsCount) return false;
      showProject(nextIndex);
      return true;
    },
    [projectsCount, showProject]
  );

  const showNextProject = useCallback(() => showProjectBy(1), [showProjectBy]);
  const showPreviousProject = useCallback(
    () => showProjectBy(-1),
    [showProjectBy]
  );

  // Start from the first card when coming from the title, from the last one when coming back from the contact form
  useEffect(() => {
    if (scrollProgress !== projectsListScrollProgress) return;
    const startIndex =
      previousScrollProgress > projectsListScrollProgress
        ? projectsCount - 1
        : 0;
    activeProjectIndexRef.current = startIndex;
    setActiveProjectIndex(startIndex);
    // Only when entering the projects list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress]);

  // Scrolling, swiping and arrow keys go through the cards first, then on to the next section
  useEffect(
    () =>
      registerScrollInterceptor(
        projectsListScrollProgress,
        (direction, { axis }) => {
          const isRotating =
            performance.now() - lastChangeTimeRef.current < cardChangeLockMs;
          if (isRotating) return true;

          const hasChangedProject = showProjectBy(direction);
          // Horizontal input never leaves the carousel
          return hasChangedProject || axis === "horizontal";
        }
      ),
    [registerScrollInterceptor, showProjectBy]
  );

  const value = useMemo(
    () => ({
      activeProjectIndex,
      projectsCount,
      showProject,
      showNextProject,
      showPreviousProject,
    }),
    [
      activeProjectIndex,
      projectsCount,
      showProject,
      showNextProject,
      showPreviousProject,
    ]
  );

  return (
    <ProjectsCarouselContext.Provider value={value}>
      {children}
    </ProjectsCarouselContext.Provider>
  );
}

export function useProjectsCarousel() {
  return useContext(ProjectsCarouselContext);
}
