import { Suspense } from "react";

import SpaceCanvas from "@/canvases/space/SpaceCanvas";
import AnimateDocumentTitle from "@/components/AnimateDocumentTitle";
import CertificatesPanel from "@/components/CertificatesPanel";
import ContactPanel from "@/components/contact/ContactPanel";
import DebugUI from "@/components/DebugUI";
import MobileWarning from "@/components/MobileWarning";
import Providers from "@/components/Providers";
import SceneContainer from "@/components/SceneContainer";
import SceneErrorBoundary from "@/components/SceneErrorBoundary";
import SectionNavigation from "@/components/SectionNavigation";
import StartupScreen from "@/components/StartupScreen";
import Toaster from "@/components/Toaster";
import TopBar from "@/components/TopBar";
import useViewportCssVariables from "@/hooks/useViewportCssVariables";

function App() {
  useViewportCssVariables();

  return (
    <Providers>
      {/* Leva debug UI */}
      <DebugUI />

      {/* Notifications toaster */}
      <Toaster />

      {/* TopBar */}
      <TopBar />

      {/* Startup loading/menu screen */}
      <StartupScreen />

      <SceneContainer>
        {/* 3D space canvas */}
        <SceneErrorBoundary>
          <Suspense>
            <SpaceCanvas />
          </Suspense>
        </SceneErrorBoundary>

        {/* Scrollable certificates list next to Jupiter */}
        <CertificatesPanel />

        {/* Contact form on small screens */}
        <ContactPanel />
      </SceneContainer>

      {/* Fades the screen out and in for camera cuts (reduced motion) */}
      <div
        id="scene-transition-veil"
        className="fixed inset-0 z-[35] bg-black opacity-0 pointer-events-none"
        aria-hidden
      />

      {/* Document title changer */}
      <AnimateDocumentTitle />

      {/* Bottom section navigation */}
      <SectionNavigation />

      {/* Small screens notice */}
      <MobileWarning />
    </Providers>
  );
}

export default App;
