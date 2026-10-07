import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useScrollContext } from "@/contexts/ScrollContext";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import {
  certificatesListScrollProgress,
  certificatesTitleScrollProgress,
  contactFormScrollProgress,
  heroAboutMeScrollProgress,
  heroMyOriginScrollProgress,
  heroWelcomeTextCloseupScrollProgress,
  heroWelcomeTextScrollProgress,
  jobExperienceDownloadResumeScrollProgress,
  jobExperienceListScrollProgress,
  jobExperienceTitleScrollProgress,
  projectsListScrollProgress,
  projectsTitleScrollProgress,
} from "@/lib/sections";

type CameraState = {
  position: [number, number, number];
  rotation: [number, number, number];
};

// Final camera pose of every camera stop (the end state of the animations below)
const CAMERA_STATES: Record<number, CameraState> = {
  [heroWelcomeTextScrollProgress]: {
    position: [0.51, 0.6, -19.85],
    rotation: [0, 2.78, 0],
  },
  [heroWelcomeTextCloseupScrollProgress]: {
    position: [0.55, 0.6, -11.91],
    rotation: [0, 3.3, 0],
  },
  [heroAboutMeScrollProgress]: {
    position: [-4.62, -0.28, -7.44],
    rotation: [0.06, -0.46, 0],
  },
  [heroMyOriginScrollProgress]: {
    position: [2.4, 0.6, -17.25],
    rotation: [0.14, 2, -0.08],
  },
  [jobExperienceTitleScrollProgress]: {
    position: [10, 0.6, -83],
    rotation: [0, 0, 0],
  },
  [jobExperienceListScrollProgress]: {
    position: [10, 0, -100],
    rotation: [-Math.PI * 2, Math.PI, 0],
  },
  [jobExperienceDownloadResumeScrollProgress]: {
    position: [8, 0, -92],
    rotation: [-Math.PI * 2, Math.PI, 0],
  },
  [certificatesTitleScrollProgress]: {
    position: [-150, 0.6, -450],
    rotation: [-Math.PI * 2, 0, 0],
  },
  [certificatesListScrollProgress]: {
    position: [-280, 0.6, -560],
    rotation: [-Math.PI * 2, -1.8, 0],
  },
  [projectsTitleScrollProgress]: {
    position: [-780, 0.6, 1470],
    rotation: [-Math.PI * 2, -0.75, 0],
  },
  [projectsListScrollProgress]: {
    position: [-680, 20, 1330],
    rotation: [-Math.PI * 2 + 0.2, -Math.PI * 3, -0.32],
  },
  [contactFormScrollProgress]: {
    position: [1942, 20, -199],
    rotation: [-Math.PI * 2, -Math.PI * 3.78, 0],
  },
};

// Returns the angle equivalent to `target` that is the closest to `current`, so the camera never spins around needlessly
function getClosestEquivalentAngle(current: number, target: number) {
  const fullTurn = Math.PI * 2;
  return target + Math.round((current - target) / fullTurn) * fullTurn;
}

/**
 * Hand-crafted camera animations between neighbouring camera stops. Returns the total animation duration in seconds
 */
function playCameraChoreography(
  camera: THREE.Camera,
  scrollProgress: number,
  previousScrollProgress: number
): number {
  switch (scrollProgress) {
    /**
     * Neptune contact form
     */
    case contactFormScrollProgress: {
      gsap.to(camera.position, {
        ease: "power2.inOut",
        x: 1942,
        y: 20,
        z: -199,
        duration: 8,
      });

      gsap.to(camera.rotation, {
        ease: "sine.out",
        x: -Math.PI * 2,
        y: -Math.PI * 3.78,
        z: 0,
        duration: 8,
      });

      return 8;
    }

    /**
     * Saturn projects list
     */
    case projectsListScrollProgress: {
      gsap.to(camera.position, {
        ease: "sine.inOut",
        x: -680,
        y: 20,
        z: 1330,
        duration: 7,
      });

      gsap.to(camera.rotation, {
        ease: "sine.inOut",
        x: -Math.PI * 2 + 0.2,
        y: -Math.PI * 3,
        z: -0.32,
        duration: 7,
      });

      return 7;
    }

    /**
     * Saturn projects title
     */
    case projectsTitleScrollProgress: {
      // Change reverse animation
      if (previousScrollProgress === projectsListScrollProgress) {
        gsap.to(camera.position, {
          ease: "sine.inOut",
          x: -780,
          y: 0.6,
          z: 1470,
          duration: 5,
        });

        gsap.to(camera.rotation, {
          ease: "sine.inOut",
          x: -Math.PI * 2,
          y: -0.75,
          z: 0,
          duration: 5,
        });

        return 5;
      }

      gsap.to(camera.position, {
        ease: "power2.inOut",
        x: -780,
        y: 0.6,
        z: 1470,
        duration: 8,
      });

      gsap
        .timeline()
        .to(camera.rotation, {
          ease: "sine.in",
          y: -1.5,
          duration: 2,
        })
        .to(camera.rotation, {
          ease: "sine.out",
          x: -Math.PI * 2,
          y: -0.75,
          z: 0,
          duration: 6,
        });

      return 8;
    }

    /**
     * Jupiter certificates list
     */
    case certificatesListScrollProgress: {
      gsap.to(camera.position, {
        ease: "sine.inOut",
        x: -280,
        y: 0.6,
        z: -560,
        duration: 3,
      });

      gsap.to(camera.rotation, {
        ease: "sine.inOut",
        y: -1.8,
        duration: 3,
      });

      return 3;
    }

    /**
     * Jupiter certificates title
     */
    case certificatesTitleScrollProgress: {
      // Change reverse animation
      if (previousScrollProgress === certificatesListScrollProgress) {
        gsap.to(camera.position, {
          ease: "sine.inOut",
          x: -150,
          y: 0.6,
          z: -450,
          duration: 2,
        });

        gsap.to(camera.rotation, {
          ease: "sine.inOut",
          y: 0,
          duration: 2,
        });

        return 2;
      }

      gsap
        .timeline()
        .to(camera.position, {
          ease: "sine.in",
          x: -50,
          y: 0.6,
          z: -220,
          duration: 3,
        })
        .to(camera.position, {
          ease: "sine.out",
          x: -150,
          y: 0.6,
          z: -450,
          duration: 2,
        });

      gsap.to(camera.rotation, {
        ease: "power4.out",
        y: 0,
        delay: 1.5,
        duration: 5,
      });

      return 5;
    }

    /**
     * Mars job experience download resume
     */
    case jobExperienceDownloadResumeScrollProgress: {
      gsap.to(camera.position, {
        ease: "sine.inOut",
        x: 8,
        y: 0,
        z: -92,
        duration: 1.75,
      });

      gsap.to(camera.rotation, {
        ease: "sine.inOut",
        y: Math.PI,
        delay: 1.5,
        duration: 1.5,
      });

      // Coming back from Jupiter, the camera also turns around after arriving
      return previousScrollProgress === certificatesTitleScrollProgress
        ? 3
        : 1.75;
    }

    /**
     * Mars job experience list
     */
    case jobExperienceListScrollProgress: {
      // Change reverse animation
      if (previousScrollProgress === jobExperienceDownloadResumeScrollProgress) {
        gsap.to(camera.position, {
          ease: "sine.inOut",
          x: 10,
          y: 0,
          z: -100,
          duration: 1.75,
        });

        gsap.to(camera.rotation, {
          ease: "sine.inOut",
          y: Math.PI,
          duration: 1.5,
        });

        return 1.75;
      }

      gsap
        .timeline()
        .to(camera.position, {
          ease: "sine.in",
          x: 10,
          y: 5,
          z: -90,
          duration: 1.75,
        })
        .to(camera.position, {
          ease: "sine.out",
          x: 10,
          y: 0,
          z: -100,
          duration: 1.75,
        });

      gsap
        .timeline()
        .to(camera.rotation, {
          ease: "sine.in",
          x: -Math.PI / 2,
          duration: 1.75,
        })
        .to(camera.rotation, {
          ease: "sine",
          x: -Math.PI * 2,
          duration: 1.75,
        });

      gsap.to(camera.rotation, {
        ease: "sine.inOut",
        y: Math.PI,
        delay: 1.5,
        duration: 1.5,
      });

      return 3.5;
    }

    /**
     * Mars job experience title
     */
    case jobExperienceTitleScrollProgress: {
      // Change reverse animation
      if (previousScrollProgress === jobExperienceListScrollProgress) {
        gsap
          .timeline()
          .to(camera.position, {
            ease: "sine.in",
            x: 10,
            y: 5,
            z: -90,
            duration: 1.75,
          })
          .to(camera.position, {
            ease: "sine.out",
            x: 10,
            y: 0.6,
            z: -83,
            duration: 1.75,
          });

        gsap.to(camera.rotation, {
          ease: "sine.inOut",
          x: 0,
          delay: 0.75,
          duration: 3,
        });

        gsap.to(camera.rotation, {
          ease: "sine.inOut",
          y: 0,
          delay: 1.5,
          duration: 1.5,
        });

        return 3.5;
      }

      gsap.to(camera.position, {
        ease: "sine.inOut",
        x: 10,
        y: 0.6,
        z: -83,
        duration: 3.5,
      });

      gsap.to(camera.rotation, {
        ease: "sine.out",
        x: 0,
        y: 0,
        z: 0,
        duration: 3.5,
      });

      return 3.5;
    }

    /**
     * Earth hero my origin
     */
    case heroMyOriginScrollProgress: {
      gsap.to(camera.position, {
        ease: "sine.out",
        x: 2.4,
        y: 0.6,
        z: -17.25,
        duration: 2.25,
      });

      gsap.to(camera.rotation, {
        ease: "sine.out",
        x: 0.14,
        y: 2,
        z: -0.08,
        duration: 2.25,
      });

      return 2.25;
    }

    /**
     * Earth hero about me
     */
    case heroAboutMeScrollProgress: {
      // Change reverse animation
      if (previousScrollProgress === heroMyOriginScrollProgress) {
        gsap
          .timeline()
          .to(camera.position, {
            ease: "power1.in",
            x: 2,
            y: 1,
            z: -16,
            duration: 1.75,
          })
          .to(camera.position, {
            ease: "power1.out",
            x: -4.62,
            y: -0.28,
            z: -7.44,
            duration: 1.75,
          });

        gsap.to(camera.rotation, {
          ease: "sine.out",
          x: 0.06,
          y: -0.46,
          z: 0,
          duration: 3.5,
        });

        return 3.5;
      }

      gsap.to(camera.position, {
        ease: "power4.out",
        x: -4.62,
        y: -0.28,
        z: -7.44,
        duration: 3.5,
      });

      gsap.to(camera.rotation, {
        ease: "power4.out",
        x: 0.06,
        y: -0.46,
        z: 0.0,
        duration: 3.5,
      });

      return 3.5;
    }

    /**
     * Earth hero welcome text closeup
     */
    case heroWelcomeTextCloseupScrollProgress: {
      gsap.to(camera.position, {
        ease: "sine.inOut",
        x: 0.55,
        y: 0.6,
        z: -11.91,
        duration: 1,
      });

      gsap.to(camera.rotation, {
        ease: "sine.inOut",
        x: 0.0,
        y: 3.3,
        z: 0.0,
        duration: 1,
      });

      return 1;
    }

    /**
     * Earth hero welcome text overview
     */
    case heroWelcomeTextScrollProgress:
    default: {
      gsap.to(camera.position, {
        ease: "sine.inOut",
        x: 0.51,
        y: 0.6,
        z: -19.85,
        duration: 1,
      });

      gsap.to(camera.rotation, {
        ease: "sine.inOut",
        x: 0.0,
        y: 2.78,
        z: 0.0,
        duration: 1,
      });

      return 1;
    }
  }
}

function snapCameraRotation(camera: THREE.Camera, cameraState: CameraState) {
  camera.rotation.set(...cameraState.rotation);
}

/**
 * Direct flight between two camera stops that aren't neighbours, along an arc that passes above the planets
 */
function playCameraFlight(
  camera: THREE.Camera,
  cameraState: CameraState,
  flightProgress: { value: number }
): number {
  const startPosition = camera.position.clone();
  const endPosition = new THREE.Vector3(...cameraState.position);
  const distance = startPosition.distanceTo(endPosition);
  const duration = THREE.MathUtils.clamp(1.2 + distance / 600, 1.2, 4);

  const controlPoint = startPosition
    .clone()
    .add(endPosition)
    .multiplyScalar(0.5);
  controlPoint.y += Math.min(distance * 0.3, 450);
  const curve = new THREE.QuadraticBezierCurve3(
    startPosition,
    controlPoint,
    endPosition
  );

  flightProgress.value = 0;
  gsap.to(flightProgress, {
    value: 1,
    duration,
    ease: "power2.inOut",
    onUpdate: () => {
      curve.getPoint(flightProgress.value, camera.position);
    },
  });

  gsap.to(camera.rotation, {
    x: getClosestEquivalentAngle(camera.rotation.x, cameraState.rotation[0]),
    y: getClosestEquivalentAngle(camera.rotation.y, cameraState.rotation[1]),
    z: getClosestEquivalentAngle(camera.rotation.z, cameraState.rotation[2]),
    duration,
    ease: "power2.inOut",
    // The equivalent angles look the same but the choreographies expect the exact values
    onComplete: () => snapCameraRotation(camera, cameraState),
  });

  return duration;
}

/**
 * Instant cut hidden behind a short fade to black, for people who prefer reduced motion
 */
function playCameraCut(camera: THREE.Camera, cameraState: CameraState): number {
  const veilEl = document.getElementById("scene-transition-veil");
  const halfDuration = 0.25;

  gsap
    .timeline()
    .to(veilEl, { opacity: 1, duration: halfDuration, ease: "none" })
    .call(() => {
      camera.position.set(...cameraState.position);
      snapCameraRotation(camera, cameraState);
    })
    .to(veilEl, { opacity: 0, duration: halfDuration, ease: "none" });

  return halfDuration * 2;
}

function CameraControls() {
  const { camera } = useThree();
  const {
    scrollProgress,
    previousScrollProgress,
    setIsScrollingPaused,
    setCameraAnimationDuration,
  } = useScrollContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const flightProgressRef = useRef({ value: 0 });
  const unpauseScrollingDelayedCallRef = useRef<gsap.core.Tween>(null);
  // Camera stop where the camera has actually arrived (null while it's moving)
  const settledScrollProgressRef = useRef<number | null>(scrollProgress);

  // Timeline camera animation
  useEffect(() => {
    const cameraState = CAMERA_STATES[scrollProgress];
    if (!cameraState) return;

    // Stop the previous animation, the new one starts from wherever the camera is now
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(camera.rotation);
    gsap.killTweensOf(flightProgressRef.current);
    unpauseScrollingDelayedCallRef.current?.kill();

    // The hand-crafted animations expect the camera to start exactly at the previous stop.
    // After an interrupted animation (e.g. a quick jump from the navigation) a direct flight is used instead.
    const hasSettledAtPreviousStop =
      settledScrollProgressRef.current === previousScrollProgress;
    const isNeighbouringStop =
      Math.abs(scrollProgress - previousScrollProgress) <= 1;
    settledScrollProgressRef.current = null;

    let totalAnimationDuration: number;
    if (prefersReducedMotion)
      totalAnimationDuration = playCameraCut(camera, cameraState);
    else if (isNeighbouringStop && hasSettledAtPreviousStop)
      totalAnimationDuration = playCameraChoreography(
        camera,
        scrollProgress,
        previousScrollProgress
      );
    else
      totalAnimationDuration = playCameraFlight(
        camera,
        cameraState,
        flightProgressRef.current
      );

    setCameraAnimationDuration(totalAnimationDuration);

    // Unpause further scrolling when the animation is finished
    unpauseScrollingDelayedCallRef.current = gsap.delayedCall(
      totalAnimationDuration,
      () => {
        settledScrollProgressRef.current = scrollProgress;
        setIsScrollingPaused(false);
      }
    );
    // previousScrollProgress and prefersReducedMotion are read at the moment of navigation only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, scrollProgress, setIsScrollingPaused, setCameraAnimationDuration]);

  // Cleanup on unmount
  useEffect(() => {
    const flightProgress = flightProgressRef.current;
    return () => {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(camera.rotation);
      gsap.killTweensOf(flightProgress);
      unpauseScrollingDelayedCallRef.current?.kill();
    };
  }, [camera]);

  return null;
}

export default CameraControls;
