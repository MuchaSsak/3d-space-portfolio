import { Float } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import AsteroidsModel from "@/canvases/space/asteroids/components/AsteroidsModel";
import useJobExperienceListAsteroidsEntryAnimations, {
  type AsteroidEntryAnimation,
} from "@/canvases/space/sections/jobExperienceSection/hooks/useJobExperienceListAsteroidsEntryAnimations";
import useLoadJobExperienceListAsteroidsTextures from "@/canvases/space/sections/jobExperienceSection/hooks/useLoadJobExperienceListAsteroidsTextures";
import { useJobExperienceDialog } from "@/contexts/JobExperienceDialogContext";
import { useScrollContext } from "@/contexts/ScrollContext";
import { JOB_EXPERIENCE_LIST, type JobExperienceId } from "@/lib/constants";
import {
  jobExperienceDownloadResumeScrollProgress,
  jobExperienceListScrollProgress,
  jobExperienceTitleScrollProgress,
} from "@/lib/sections";

type AsteroidConfig = {
  id: JobExperienceId;
  scale: number;
  rotation: [number, number, number];
  animationSpeed: number;
  inPosition: [number, number, number];
  outPosition: [number, number, number];
  outEase?: string;
  logo: {
    position: [number, number, number];
    rotation: [number, number, number];
    size: [number, number];
  };
  // Where the label sits once the asteroid has arrived (world space, below the logo)
  labelPosition: [number, number, number];
};

const ASTEROIDS: AsteroidConfig[] = [
  {
    id: "beniaminek",
    scale: 0.14,
    rotation: [0.1, 2.1, 0],
    animationSpeed: 0.04,
    inPosition: [13, 1, -90],
    outPosition: [25, 0, -80],
    outEase: "sine.in",
    logo: {
      position: [10, -3, 5],
      rotation: [0, Math.PI / 2, 0],
      size: [5.5, 5.5],
    },
    labelPosition: [13.45, 0.15, -90],
  },
  {
    id: "cetuspro",
    scale: 0.12,
    rotation: [1, 3.5, -0.3],
    animationSpeed: 0.06,
    inPosition: [9.95, 2.75, -90],
    outPosition: [9.95, 10, -80],
    logo: {
      position: [2, -13, 5],
      rotation: [0.7, -0.1, 0.4],
      size: [14, 3.35],
    },
    labelPosition: [9.85, 2.05, -90],
  },
  {
    id: "neoteric",
    scale: 0.13,
    rotation: [0.3, 3, 0.1],
    animationSpeed: 0.05,
    inPosition: [6, 0.8, -90],
    outPosition: [-15, 0, -80],
    logo: {
      position: [0, -3, 5],
      rotation: [0.3, 0, 0],
      size: [15, 1.98],
    },
    labelPosition: [5.6, 0.2, -90],
  },
];

function JobExperienceListAsteroids() {
  const textures = useLoadJobExperienceListAsteroidsTextures();
  const { scrollProgress } = useScrollContext();
  const { openJobExperienceDialog } = useJobExperienceDialog();
  const isActive = scrollProgress === jobExperienceListScrollProgress;

  const beniaminekAsteroidRef = useRef<THREE.Group>(null);
  const cetusproAsteroidRef = useRef<THREE.Group>(null);
  const neotericAsteroidRef = useRef<THREE.Group>(null);
  const asteroidRefs: Record<
    JobExperienceId,
    React.RefObject<THREE.Group | null>
  > = {
    beniaminek: beniaminekAsteroidRef,
    cetuspro: cetusproAsteroidRef,
    neoteric: neotericAsteroidRef,
  };

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register, isRendered } = useAnimateObjectVisibility({
    visibleRange: [
      jobExperienceListScrollProgress,
      jobExperienceListScrollProgress,
    ],
    renderedRange: [
      jobExperienceTitleScrollProgress,
      jobExperienceDownloadResumeScrollProgress,
    ],
  });

  // Animate position in and out of the asteroids
  const entryAnimations: AsteroidEntryAnimation[] = useMemo(
    () =>
      ASTEROIDS.map(({ id, inPosition, outPosition, outEase }) => ({
        ref: asteroidRefs[id],
        inPosition,
        outPosition,
        outEase,
      })),
    // The refs are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useJobExperienceListAsteroidsEntryAnimations(entryAnimations, isRendered);

  // Labels appear once the asteroids have flown in
  const { register: registerLabel } = useAnimateObjectVisibility({
    visibleRange: [
      jobExperienceListScrollProgress,
      jobExperienceListScrollProgress,
    ],
    showOptions: { delay: 2 },
    hideOptions: { duration: 0.4 },
  });

  // Never leave the pointer cursor behind when the asteroids unmount
  useEffect(() => {
    if (!isActive) document.body.style.cursor = "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [isActive]);

  function handlePointerEnterAsteroid(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    if (isActive) document.body.style.cursor = "pointer";
  }

  function handlePointerLeaveAsteroid() {
    document.body.style.cursor = "";
  }

  function handleClickAsteroid(
    e: ThreeEvent<MouseEvent>,
    jobExperienceId: JobExperienceId
  ) {
    e.stopPropagation();
    if (!isActive) return;
    document.body.style.cursor = "";
    openJobExperienceDialog(jobExperienceId);
  }

  if (!isRendered) return null;

  return (
    <>
      {/* Accessible labels, also clickable */}
      {ASTEROIDS.map((asteroid) => {
        const { company, Occupation, Period } = JOB_EXPERIENCE_LIST[asteroid.id];

        return (
          <SceneHtml
            key={`${asteroid.id}-label`}
            position={asteroid.labelPosition}
            center
            isActive={isActive}
            className="select-none"
          >
            <button
              ref={registerLabel}
              type="button"
              onClick={() => openJobExperienceDialog(asteroid.id)}
              className="opacity-0 flex flex-col items-center rounded-lg px-3 py-1.5 text-center bg-background/55 backdrop-blur-sm border border-foreground/15 hover:border-[#ff8080]/70 hover:bg-background/75 focus-visible:border-[#ff8080] focus-visible:ring-[3px] focus-visible:ring-[#ff8080]/40 outline-none transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="text-base font-bold text-foreground">
                {company}
              </span>
              <span className="text-xs text-foreground/75">
                <Occupation /> · <Period />
              </span>
            </button>
          </SceneHtml>
        );
      })}

      {ASTEROIDS.map((asteroid) => {
        return (
          <group
            key={asteroid.id}
            ref={asteroidRefs[asteroid.id]}
            onPointerEnter={handlePointerEnterAsteroid}
            onPointerLeave={handlePointerLeaveAsteroid}
            onClick={(e) => handleClickAsteroid(e, asteroid.id)}
            scale={asteroid.scale}
            position={asteroid.outPosition}
            rotation={asteroid.rotation}
          >
            <AsteroidsModel animationSpeed={asteroid.animationSpeed} />

            <Float
              speed={2}
              rotationIntensity={0.2}
              floatIntensity={0.4}
              floatingRange={[0.1, 0.5]}
            >
              <mesh
                position={asteroid.logo.position}
                rotation={asteroid.logo.rotation}
              >
                <meshBasicMaterial
                  ref={register}
                  map={textures[asteroid.id]}
                  transparent
                  opacity={0}
                  depthWrite={false}
                />
                <planeGeometry args={asteroid.logo.size} />
              </mesh>

            </Float>
          </group>
        );
      })}
    </>
  );
}

export default JobExperienceListAsteroids;
