import { useEffect } from "react";

// Size of the startup control panel image (93.75rem x 52.734rem)
const startupPanelWidth = 1500;
const startupPanelHeight = 843.75;
// Width of the panel part holding the buttons, the side consoles around it are only decoration
const startupPanelControlsWidth = 820;

/**
 * Keeps CSS variables that depend on the viewport size up to date
 */
function useViewportCssVariables() {
  useEffect(() => {
    function handleResize() {
      // On portrait screens the side consoles get cropped, otherwise the buttons would be too tiny to read and tap
      const isPortrait = window.innerHeight > window.innerWidth;
      const startupScale = Math.min(
        1.6,
        window.innerWidth /
          (isPortrait ? startupPanelControlsWidth : startupPanelWidth),
        window.innerHeight / startupPanelHeight
      );
      document.documentElement.style.setProperty(
        "--startup-scale",
        startupScale.toFixed(3)
      );
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
}

export default useViewportCssVariables;
