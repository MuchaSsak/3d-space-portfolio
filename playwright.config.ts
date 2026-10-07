import { defineConfig, devices } from "@playwright/test";

const port = 5299;

/**
 * End-to-end tests of the whole experience in a real browser.
 * The 3D scene needs a real GPU: in software rendering (e.g. GPU-less CI runners) it runs at a few frames per second.
 */
export default defineConfig({
  testDir: "./e2e",
  // A full walk through the experience takes a while (camera flights last up to 8 seconds)
  timeout: 4 * 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  // Every test renders the whole 3D scene, more of them at once starve the GPU and make the timings flaky
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://localhost:${port}`,
    viewport: { width: 1920, height: 1080 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      // Headless Chromium falls back to software rendering unless told to use the GPU
      args: [
        "--enable-gpu",
        "--ignore-gpu-blocklist",
        `--use-angle=${process.platform === "win32" ? "d3d11" : "default"}`,
      ],
    },
  },

  webServer: {
    command: `yarn dev --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
