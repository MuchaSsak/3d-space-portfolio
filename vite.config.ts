import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// Libraries split into their own chunks. A manual chunk takes in all of its dependencies that no other manual chunk claims:
// - React (and the CommonJS interop helper) get their own chunk, otherwise they'd end up in the 3D chunks and every page would load three.js
// - The React Three libraries share one chunk, as separate chunks could each claim dependencies of the other and import each other (a cycle that crashes at startup)
const vendorChunks: Record<string, string[]> = {
  react: ["react", "react-dom", "scheduler"],
  three: ["three"],
  gsap: ["gsap"],
  "react-three": [
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
  ],
};

function getVendorChunkName(moduleId: string) {
  if (moduleId.includes("commonjsHelpers")) return "react";

  return Object.keys(vendorChunks).find((chunkName) =>
    vendorChunks[chunkName].some((packageName) =>
      moduleId.includes(`/node_modules/${packageName}/`)
    )
  );
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        // Lightweight standalone page, served at /privacy-policy/
        privacyPolicy: path.resolve(__dirname, "privacy-policy/index.html"),
      },
      output: {
        manualChunks: getVendorChunkName,
      },
    },
  },
  assetsInclude: ["**/*.fbx", "**/*.hdr"],
  plugins: [
    react({ plugins: [["@lingui/swc-plugin", {}]] }),
    tailwindcss(),
    lingui(),
  ],
});
