import { useLingui } from "@lingui/react/macro";
import {
  Billboard,
  Float,
  Text3D,
  useFont,
  useTexture,
} from "@react-three/drei";

import SceneHtml from "@/canvases/components/SceneHtml";
import useAnimateObjectVisibility from "@/canvases/hooks/useAnimateObjectVisibility";
import { useScrollContext } from "@/contexts/ScrollContext";
import {
  heroWelcomeTextCloseupScrollProgress,
  heroWelcomeTextScrollProgress,
} from "@/lib/sections";

const fontUrl = "/assets/fonts/Space_Grotesk_Bold_Title.json";
const matcapUrls = [
  "/assets/textures/matcaps/3F4441_D1D7D6_888F87_A2ADA1-128px.png",
  "/assets/textures/matcaps/C09E5C_DAD2B9_654429_81582D-128px.png",
];

function HeroWelcomeText() {
  const { t } = useLingui();
  const { scrollProgress } = useScrollContext();
  // Self-hosted copies of the matcaps (no runtime requests to third-party CDNs)
  const [matcapTextureSilver, matcapTextureGold] = useTexture(matcapUrls);

  // Hide text when the current section viewed is not appriopriate for it to appear
  const { register, isRendered } = useAnimateObjectVisibility({
    visibleRange: [
      heroWelcomeTextScrollProgress,
      heroWelcomeTextCloseupScrollProgress,
    ],
    renderedRange: [
      heroWelcomeTextScrollProgress,
      heroWelcomeTextCloseupScrollProgress + 1,
    ],
  });
  if (!isRendered) return null;

  const isActive =
    scrollProgress >= heroWelcomeTextScrollProgress &&
    scrollProgress <= heroWelcomeTextCloseupScrollProgress;

  return (
    <group>
      <Float
        speed={1}
        rotationIntensity={0.05}
        floatIntensity={0.05}
        floatingRange={[0.005, 0.02]}
      >
        <Billboard position={[11, -0.5, -12.5]}>
          <Text3D
            userData={{ lensflare: "no-occlusion" }}
            curveSegments={4}
            bevelEnabled
            bevelSize={0.02}
            bevelThickness={0.06}
            height={0.05}
            lineHeight={0.5}
            scale={1.15}
            letterSpacing={-0.02}
            position={[3, 1, -12.5]}
            font={fontUrl}
          >
            MUSZARSKI
            <meshMatcapMaterial
              matcap={matcapTextureSilver}
              ref={register}
              transparent
              opacity={0}
            />
          </Text3D>

          <Text3D
            userData={{ lensflare: "no-occlusion" }}
            curveSegments={4}
            height={0.05}
            bevelEnabled
            bevelSize={0.02}
            bevelThickness={0.06}
            lineHeight={0.5}
            scale={1.15}
            letterSpacing={-0.02}
            position={[3, -0.75, -12.5]}
            font={fontUrl}
          >
            PORTFOLIO
            <meshMatcapMaterial
              matcap={matcapTextureGold}
              ref={register}
              transparent
              opacity={0}
            />
          </Text3D>

          {/* Visually hidden page heading, so screen readers still get who this is */}
          <SceneHtml position={[3.05, -1.25, -12.5]} isActive={isActive}>
            <h1 className="sr-only">
              Mateusz Muszarski — {t`Full-stack product engineer`}.{" "}
              {t`Web and mobile products in TypeScript, React and three.js`}
            </h1>
          </SceneHtml>
        </Billboard>
      </Float>
    </group>
  );
}

// Load them with the rest of the scene, before START (the text itself mounts a bit later)
useTexture.preload(matcapUrls);
useFont.preload(fontUrl);

export default HeroWelcomeText;
