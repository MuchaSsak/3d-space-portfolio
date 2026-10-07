import { I18nProvider } from "@lingui/react";
import { Html } from "@react-three/drei";
import { type ComponentProps, useContext } from "react";

import { LanguageContext } from "@/contexts/LanguageContext";
import { ScrollContext } from "@/contexts/ScrollContext";
import { SettingsContext } from "@/contexts/SettingsContext";
import { i18n } from "@/lib/languages";
import { cn } from "@/lib/utils";

type SceneHtmlProps = ComponentProps<typeof Html> & {
  // Inactive content is hidden from assistive technologies and can't be focused or clicked
  isActive?: boolean;
};

// Stays below the top bar (z-40) and the startup screen, unlike Drei's default range that reaches 16777271
const sceneHtmlZIndexRange: [number, number] = [30, 10];

/**
 * Drei's <Html /> renders its children into a separate React root, which loses every context.
 * This wrapper bridges the app contexts back in and handles the active/inactive state of the content.
 */
function SceneHtml({
  children,
  isActive = true,
  zIndexRange = sceneHtmlZIndexRange,
  style,
  pointerEvents,
  className,
  transform,
  ...props
}: SceneHtmlProps) {
  const settingsContext = useContext(SettingsContext);
  const scrollContext = useContext(ScrollContext);
  const languageContext = useContext(LanguageContext);

  return (
    <Html
      zIndexRange={zIndexRange}
      // Inactive content must never catch clicks meant for the scene or other content
      pointerEvents={isActive ? pointerEvents : "none"}
      style={isActive ? style : { ...style, pointerEvents: "none" }}
      transform={transform}
      // Screen-space content scales with the 3D scene, so the composition stays the same on every screen
      className={transform ? className : cn("scene-scaled", className)}
      {...props}
    >
      <LanguageContext.Provider value={languageContext}>
        <I18nProvider i18n={i18n}>
          <SettingsContext.Provider value={settingsContext}>
            <ScrollContext.Provider value={scrollContext}>
              <div
                className={isActive ? "contents" : "contents pointer-events-none select-none"}
                inert={!isActive}
                aria-hidden={isActive ? undefined : true}
              >
                {children}
              </div>
            </ScrollContext.Provider>
          </SettingsContext.Provider>
        </I18nProvider>
      </LanguageContext.Provider>
    </Html>
  );
}

export default SceneHtml;
