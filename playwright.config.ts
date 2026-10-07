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
  // Every test renders the whole 3D scene: even two at once can starve an integrated GPU and the memory,
  // freezing the pages. Machines with more headroom can pass --workers=2.
  workers: 1,
  // Two heavy WebGL pages at once can still run the machine out of memory or stall a frame for seconds.
  // A retried test is reported as flaky, so it stays visible.
  retries: 1,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://localhost:${port}`,
    viewport: { width: 1920, height: 1080 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Recording every test costs CPU the scene needs, the trace already has a screencast
    video: "on-first-retry",
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
