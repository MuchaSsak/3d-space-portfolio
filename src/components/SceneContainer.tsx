import { useSettingsContext } from "@/contexts/SettingsContext";

// Everything of the experience stays non-interactive behind the startup screen until START is pressed
function SceneContainer({ children }: { children: React.ReactNode }) {
  const { hasStartedExperience } = useSettingsContext();

  return (
    <main className="contents" inert={!hasStartedExperience}>
      {children}
    </main>
  );
}

export default SceneContainer;
