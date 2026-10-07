import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import ProjectsItemCard from "@/canvases/space/sections/projectsSection/components/ProjectsItemCard";
import { useProjectsCarousel } from "@/contexts/ProjectsCarouselContext";
import { useScrollContext } from "@/contexts/ScrollContext";
import { PROJECTS_LIST } from "@/lib/constants";
import { requestContact } from "@/lib/contactRequest";
import {
  contactFormScrollProgress,
  projectsListScrollProgress,
} from "@/lib/sections";

/**
 * Carousel layout: cards sit on a circle above Saturn, the active one faces the camera
 */
const carouselRadius = 100;
const carouselPhi = Math.PI / 4;
const carouselCenter = new THREE.Vector3(-680, 45, 1455);
const cardsAngleStep = (Math.PI * 2) / PROJECTS_LIST.length;
// The card at this angle is the closest one to the camera
const frontAngle = Math.PI;

function getCarouselAngleOfProject(projectIndex: number) {
  return frontAngle - cardsAngleStep * projectIndex;
}

// Shortest angular distance between two angles (0 - PI)
function getAngularDistance(a: number, b: number) {
  const fullTurn = Math.PI * 2;
  const difference = (((a - b) % fullTurn) + fullTurn) % fullTurn;
  return Math.min(difference, fullTurn - difference);
}

function ProjectsList() {
  const { scrollProgress, goToScrollProgress, cameraAnimationDuration } =
    useScrollContext();
  const { activeProjectIndex, showProject } = useProjectsCarousel();
  const isActive = scrollProgress === projectsListScrollProgress;

  const cardGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const cardElementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const carouselAngleRef = useRef({
    value: getCarouselAngleOfProject(activeProjectIndex),
  });
  const spherical = useMemo(() => new THREE.Spherical(), []);

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register, isVisible } = useAnimateObjectVisibility({
    visibleRange: [projectsListScrollProgress, projectsListScrollProgress],
    // Halfway through the camera flight (3.5s of the 7s flight from the title)
    showOptions: { delay: cameraAnimationDuration / 2 },
    hideOptions: { delay: 0.5 },
  });

  // Rotate the carousel to the active card (instantly while it's hidden)
  useEffect(() => {
    const carouselAngle = carouselAngleRef.current;
    const targetAngle = getCarouselAngleOfProject(activeProjectIndex);
    gsap.killTweensOf(carouselAngle);

    if (!isVisible) {
      carouselAngle.value = targetAngle;
      return;
    }

    const tween = gsap.to(carouselAngle, {
      value: targetAngle,
      duration: 0.9,
      ease: "power3.out",
    });

    return () => {
      tween.kill();
    };
  }, [activeProjectIndex, isVisible]);

  // Place the cards on the circle and fade out the ones in the back
  useFrame(() => {
    const carouselAngle = carouselAngleRef.current.value;

    PROJECTS_LIST.forEach((_, i) => {
      const cardGroup = cardGroupRefs.current[i];
      if (!cardGroup) return;

      const theta = cardsAngleStep * i + carouselAngle;
      spherical.set(carouselRadius, carouselPhi, theta);
      cardGroup.position.setFromSpherical(spherical).add(carouselCenter);

      const cardElement = cardElementRefs.current[i];
      if (!cardElement) return;
      // 1 for the front card, ~0.5 for its neighbours, ~0 for the ones in the back
      const frontness =
        (Math.cos(getAngularDistance(theta, frontAngle)) + 1) / 2;
      const opacity = Math.pow(frontness, 3.5);
      cardElement.style.opacity = opacity.toFixed(3);
      cardElement.style.visibility = opacity < 0.05 ? "hidden" : "visible";
    });
  });

  function handleRequestContact(subject: string) {
    requestContact({ topic: "project", subject });
    goToScrollProgress(contactFormScrollProgress);
  }

  return (
    <group rotation={[Math.PI * -0.025, 0, Math.PI * 0.1]}>
      {PROJECTS_LIST.map((project, i) => (
        <group
          key={project.id}
          ref={(el) => {
            cardGroupRefs.current[i] = el;
          }}
        >
          <SceneHtml
            ref={register}
            rotation={[0.2, Math.PI - 0.075, -0.015]}
            scale={2}
            transform
            className="opacity-0"
            isActive={isActive}
          >
            <div
              ref={(el) => {
                cardElementRefs.current[i] = el;
              }}
              className="will-change-[opacity]"
            >
              <ProjectsItemCard
                projectData={project}
                isFront={i === activeProjectIndex}
                onSelect={() => showProject(i)}
                onRequestContact={handleRequestContact}
              />
            </div>
          </SceneHtml>
        </group>
      ))}
    </group>
  );
}

export default ProjectsList;
