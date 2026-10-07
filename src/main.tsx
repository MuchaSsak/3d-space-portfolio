import "@/index.css";

import { createRoot } from "react-dom/client";

import App from "@/App";
import { loadDebugTools } from "@/lib/debug";

// The debug panel (#debug) is loaded before the first render, so its hooks never change between renders
loadDebugTools()
  .catch(() => {})
  .finally(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  });
