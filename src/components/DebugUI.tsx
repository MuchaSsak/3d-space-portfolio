import { getLevaModule, isDebugMode } from "@/lib/debug";

// Leva debug panel, only with the #debug hash
function DebugUI() {
  const levaModule = getLevaModule();
  if (!isDebugMode || !levaModule) return null;
  const { Leva } = levaModule;

  return (
    <div className="w-[30vw] max-h-[75vh] overflow-y-scroll fixed right-0 top-0 z-[100]">
      <Leva
        collapsed
        oneLineLabels
        titleBar={{ title: "Debug UI 🛠️" }}
        fill
      />
    </div>
  );
}

export default DebugUI;
