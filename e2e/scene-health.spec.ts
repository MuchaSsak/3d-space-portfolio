import type { Page } from "@playwright/test";

import {
  expect,
  expectStop,
  seedSettings,
  startButton,
  startExperience,
  STOP,
  test,
} from "./fixtures";

/**
 * Reads the React Three Fiber state of the running scene (development server only)
 */
async function evaluateInScene<T>(
  page: Page,
  fn: string // Body of a function receiving `state` (the R3F root state)
): Promise<T> {
  return page.evaluate(async (fn) => {
    const fiberUrl = performance
      .getEntriesByType("resource")
      .map(({ name }) => name)
      .find((name) => name.includes("/.vite/deps/@react-three_fiber.js"));
    if (!fiberUrl) throw new Error("Not running on the development server");
    const { _roots } = await import(/* @vite-ignore */ fiberUrl);
    const state = [..._roots.values()][0].store.getState();
    return new Function("state", fn)(state);
  }, fn);
}

// Where the sun (the lens flare source at the origin) is on the screen, null when it's out of view
function getSunScreenPosition(page: Page) {
  return evaluateInScene<{ x: number; y: number } | null>(
    page,
    `
    const { camera, size } = state;
    const sun = camera.position.clone().set(0, 0, 0).project(camera);
    if (sun.z > 1 || Math.abs(sun.x) > 0.9 || Math.abs(sun.y) > 0.9) return null;
    return { x: (sun.x + 1) / 2 * size.width, y: (1 - sun.y) / 2 * size.height };
    `
  );
}

// Average brightness (0-255) of the screen pixels around a point
async function getBrightnessAround(page: Page, x: number, y: number) {
  const radius = 6;
  const screenshot = await page.screenshot({
    clip: {
      x: x - radius,
      y: y - radius,
      width: radius * 2,
      height: radius * 2,
    },
  });
  return page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    const { data } = context.getImageData(0, 0, image.width, image.height);
    let sum = 0;
    for (let i = 0; i < data.length; i += 4)
      sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    return sum / (data.length / 4);
  }, screenshot.toString("base64"));
}

for (const graphics of ["low", "high"] as const)
  test(`the lens flare shines on the sun (${graphics} graphics)`, async ({
    page,
  }) => {
    await seedSettings(page, { graphics });
    await startExperience(page);

    // The welcome stop looks straight at the sun. There's no sun mesh, the bright spot is the lens flare alone.
    // It fades in over a number of frames, which takes a while at headless frame rates.
    await expect
      .poll(
        async () => {
          const sun = await getSunScreenPosition(page);
          if (!sun) return "the sun is out of view";
          return getBrightnessAround(page, sun.x, sun.y);
        },
        { message: "lens flare brightness at the sun", timeout: 15_000 }
      )
      .toBeGreaterThan(180);
  });

test("the lens flare occlusion test stays cheap", async ({ page }) => {
  await seedSettings(page, { graphics: "high" });
  await startExperience(page);

  // The lens flare raycasts the whole scene every frame to find out whether the sun is covered
  const msPerRaycast = await evaluateInScene<number>(
    page,
    `
    const { scene, camera, raycaster } = state;
    raycaster.setFromCamera(camera.position.clone().set(0, 0, 0).project(camera), camera);
    const start = performance.now();
    for (let i = 0; i < 100; i++) raycaster.intersectObjects(scene.children, true);
    return (performance.now() - start) / 100;
    `
  );
  expect(msPerRaycast).toBeLessThan(0.5);
});

test("the scene keeps a usable frame rate", async ({ page }) => {
  await seedSettings(page, { graphics: "high" });
  await startExperience(page);
  await page.keyboard.press("ArrowDown");
  await expectStop(page, STOP.welcomeCloseup);

  const { fps, longestFrameMs } = await page.evaluate(
    () =>
      new Promise<{ fps: number; longestFrameMs: number }>((resolve) => {
        const start = performance.now();
        let frames = 0;
        let previous = start;
        let longestFrameMs = 0;
        function onFrame(now: number) {
          frames++;
          longestFrameMs = Math.max(longestFrameMs, now - previous);
          previous = now;
          if (now - start < 3000) requestAnimationFrame(onFrame);
          else
            resolve({
              fps: (frames * 1000) / (now - start),
              longestFrameMs,
            });
        }
        requestAnimationFrame(onFrame);
      })
  );
  test.info().annotations.push({
    type: "performance",
    description: `${fps.toFixed(1)} fps, longest frame ${longestFrameMs.toFixed(0)} ms`,
  });
  // Headless browsers render slower than real ones, this only catches severe regressions
  expect(fps).toBeGreaterThan(15);
  expect(longestFrameMs).toBeLessThan(1000);
});

test("a missing startup image never blocks the start", async ({
  page,
  consoleErrors,
}) => {
  await page.route("**/startup_screen_background.webp", (route) =>
    route.abort()
  );

  await seedSettings(page);
  await startExperience(page);

  // Only the failed request itself may be logged, nothing may crash
  const unexpectedErrors = consoleErrors.filter(
    (error) => !/Failed to load resource/.test(error)
  );
  consoleErrors.splice(0, consoleErrors.length, ...unexpectedErrors);
});

test.describe("small screens notice", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test("is shown once, then remembered", async ({ page }) => {
    await seedSettings(page, { hasIgnoredMobileWarning: false });
    await page.goto("/");

    const notice = page.getByRole("dialog", { name: "Heads up!" });
    await expect(notice).toBeVisible({ timeout: 30_000 });
    await expect(
      notice.getByRole("link", { name: "Open the main portfolio" })
    ).toBeVisible();
    const continueButton = notice.getByRole("button", {
      name: "Continue to the 3D version",
    });
    await expect(continueButton).toBeFocused();
    await continueButton.tap();
    await expect(notice).toBeHidden();

    // The start menu is usable right after
    await expect(startButton(page)).toBeEnabled({ timeout: 60_000 });

    await page.reload();
    await expect(startButton(page)).toBeEnabled({ timeout: 60_000 });
    await expect(notice).toBeHidden();
  });
});
