import { LensFlare } from "@andersonmancini/lens-flare";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { lazy, Suspense, useState } from "react";

import useLensFlareDebugControls from "@/canvases/hooks/useLensFlareDebugControls";
import ResponsiveCamera from "@/canvases/space/components/ResponsiveCamera";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { isDebugMode } from "@/lib/debug";

// Lazy imports for code splitting
const Perf = lazy(() =>
  import("r3f-perf").then((module) => ({ default: module.Perf }))
);
const CameraControls = lazy(
  () => import("@/canvases/space/components/CameraControls")
);
const Lighting = lazy(() => import("@/canvases/space/components/Lighting"));
const SpaceContextProvider = lazy(() =>
  import("@/canvases/space/contexts/SpaceContext").then((module) => ({
    default: module.SpaceContextProvider,
  }))
);
const StarsModel = lazy(
  () => import("@/canvases/space/stars/components/StarsModel")
);
const HeroSection = lazy(
  () => import("@/canvases/space/sections/heroSection/components/HeroSection")
);
const JobExperienceSection = lazy(
  () =>
    import(
      "@/canvases/space/sections/jobExperienceSection/components/JobExperienceSection"
    )
);
const CertificatesSection = lazy(
  () =>
    import(
      "@/canvases/space/sections/certificatesSection/components/CertificatesSection"
    )
);
const ProjectsSection = lazy(
  () =>
    import(
      "@/canvases/space/sections/projectsSection/components/ProjectsSection"
    )
);
const ContactSection = lazy(
  () =>
    import("@/canvases/space/sections/contactSection/components/ContactSection")
);


function SpaceCanvas() {
  const {
    toneMapping,
    depth,
    antialias,
    multisampling,
    dpr: [minDpr, maxDpr],
    hasStartedExperience,
  } = useSettingsContext();
  const lensFlareControls = useLensFlareDebugControls();
  // Lowered automatically when the device can't keep up
  const [isDegraded, setIsDegraded] = useState(false);
  const dpr = Math.min(
    window.devicePixelRatio || 1,
    isDegraded ? minDpr : maxDpr
  );

  return (
    <Canvas
      gl={{
        toneMapping,
        antialias,
        depth,
        powerPreference: "high-performance",
      }}
      dpr={dpr}
      // Nothing moves behind the startup screen, so only render when something changes
      frameloop={hasStartedExperience ? "always" : "demand"}
      camera={{
        fov: 45,
        far: 3000,
        position: [0.51, 0.6, -19.85],
        rotation: [0.0, 2.78, 0.0],
      }}
      className="h-full! w-full!"
      // Focusing content placed off-screen must never scroll the scene container
      style={{ overflow: "clip" }}
    >
      {/* Keep the scene readable on any aspect ratio */}
      <ResponsiveCamera />

      {/* Lower the resolution when the frame rate drops (only measured while the scene is actually animating) */}
      {hasStartedExperience && (
        <PerformanceMonitor
          onDecline={() => setIsDegraded(true)}
          onIncline={() => setIsDegraded(false)}
          flipflops={3}
          onFallback={() => setIsDegraded(true)}
        />
      )}

      {/* Camera controls */}
      <CameraControls />

      {/* Lighting */}
      <Lighting />

      {/* Performance monitor */}
      {isDebugMode && <Perf position="top-left" />}

      {/* Post processing */}
      <EffectComposer multisampling={multisampling}>
        <>
          {/* Lens flare */}
          <LensFlare
            {...lensFlareControls}
            userData={{ lensflare: "no-occlusion" }}
            dirtTextureFile="/assets/textures/sun/lens_dirt_texture.jpg"
          />
        </>
      </EffectComposer>

      <Suspense fallback={null}>
        <SpaceContextProvider>
          {/* Models */}
          <StarsModel />

          {/* Sections */}
          <HeroSection />
          <JobExperienceSection />
          <CertificatesSection />
          <ProjectsSection />
          <ContactSection />
        </SpaceContextProvider>
      </Suspense>
    </Canvas>
  );
}

export default SpaceCanvas;
