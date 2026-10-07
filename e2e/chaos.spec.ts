import type { Page } from "@playwright/test";

import {
  chapterButton,
  CHAPTERS,
  expect,
  expectStop,
  getStop,
  MAX_STOP,
  seedSettings,
  startButton,
  startExperience,
  step,
  STOP,
  swipe,
  test,
  waitForSettled,
} from "./fixtures";

/**
 * Visitors who mash keys, change their mind mid-flight, resize the window or reload.
 * Whatever happens, the experience must end up on a valid stop that still responds to input.
 */

// Small deterministic random generator, so a failing run can be reproduced
function createRandom(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32;
    return seed / 2 ** 32;
  };
}

async function expectConsistentState(page: Page) {
  const stop = await getStop(page);
  expect(Number.isInteger(stop)).toBe(true);
  expect(stop).toBeGreaterThanOrEqual(STOP.welcome);
  expect(stop).toBeLessThanOrEqual(MAX_STOP);

  // The navigation highlights the chapter the camera is in
  const chapter = CHAPTERS.find(
    ({ range }) => stop >= range[0] && stop <= range[1]
  )!;
  await expect(chapterButton(page, chapter.label)).toHaveAttribute(
    "aria-current",
    "step"
  );
  return stop;
}

// After the chaos, a plain step forward or back must still work
async function expectStillResponsive(page: Page) {
  await waitForSettled(page);
  await chapterButton(page, "About").click();
  await expectStop(page, STOP.aboutMe);
  await page.keyboard.press("ArrowDown");
  await expectStop(page, STOP.myOrigin);
}

test("mashing the arrow keys never skips or breaks stops", async ({ page }) => {
  await seedSettings(page);
  await startExperience(page);

  function dispatchKeyDowns(count: number, repeat: boolean) {
    return page.evaluate(
      ({ count, repeat }) => {
        for (let i = 0; i < count; i++)
          document.body.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "ArrowDown",
              repeat,
              bubbles: true,
              cancelable: true,
            })
          );
      },
      { count, repeat }
    );
  }

  // Inputs during a camera flight are ignored, so a burst moves exactly one stop
  await dispatchKeyDowns(30, false);
  await expectStop(page, STOP.welcomeCloseup);

  // Holding a key down (auto-repeat) doesn't move at all
  await dispatchKeyDowns(30, true);
  await page.waitForTimeout(1500);
  expect(await getStop(page)).toBe(STOP.welcomeCloseup);

  // Mashing for seconds moves on after every flight, but never skips a stop
  await page.evaluate(() => {
    const nav = document.querySelector("[data-scroll-progress]")!;
    const visited = [Number(nav.getAttribute("data-scroll-progress"))];
    (window as any).__visitedStops = visited;
    new MutationObserver(() =>
      visited.push(Number(nav.getAttribute("data-scroll-progress")))
    ).observe(nav, { attributeFilter: ["data-scroll-progress"] });
  });
  const mashUntil = Date.now() + 5000;
  while (Date.now() < mashUntil) await page.keyboard.press("ArrowDown");
  await waitForSettled(page);

  const visited: number[] = await page.evaluate(
    () => (window as any).__visitedStops
  );
  expect(visited.length).toBeGreaterThan(1);
  for (let i = 1; i < visited.length; i++)
    expect(visited[i] - visited[i - 1], `stops visited: ${visited}`).toBe(1);

  await expectConsistentState(page);
  await expectStillResponsive(page);
});

test("a step and Home in the same frame don't lock the experience", async ({
  page,
}) => {
  await seedSettings(page);
  await startExperience(page);

  // Both land before React renders, so the stop ends up where it started
  await page.evaluate(() => {
    for (const key of ["ArrowDown", "Home"])
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
      );
  });
  await expectStop(page, STOP.welcome);
  await page.keyboard.press("ArrowDown");
  await expectStop(page, STOP.welcomeCloseup);
});

test("spinning the mouse wheel like crazy", async ({ page }) => {
  await seedSettings(page);
  await startExperience(page);
  await page.mouse.move(960, 900);

  for (let burst = 0; burst < 6; burst++) {
    for (let i = 0; i < 15; i++)
      await page.mouse.wheel(0, (burst % 3 === 2 ? -1 : 1) * 300);
    await page.waitForTimeout(400);
  }

  await waitForSettled(page);
  await expectConsistentState(page);
  await expectStillResponsive(page);
});

test("random walk: forward, backward, jumps and Home/End mixed together", async ({
  page,
}) => {
  test.setTimeout(8 * 60_000);
  const seed = Number(process.env.E2E_SEED ?? 20261007);
  test.info().annotations.push({ type: "seed", description: String(seed) });
  const random = createRandom(seed);

  await seedSettings(page);
  await startExperience(page);

  for (let action = 0; action < 30; action++) {
    const roll = random();
    if (roll < 0.35) await step(page, 1, "keyboard");
    else if (roll < 0.55) await step(page, -1, "keyboard");
    else if (roll < 0.7) await step(page, random() < 0.6 ? 1 : -1, "wheel");
    else if (roll < 0.85) {
      const chapter = CHAPTERS[Math.floor(random() * CHAPTERS.length)];
      await chapterButton(page, chapter.label).click();
    } else await page.keyboard.press(random() < 0.5 ? "Home" : "End");

    // Sometimes wait for the camera, sometimes interrupt it right away
    if (random() < 0.5) await waitForSettled(page);
    else await page.waitForTimeout(Math.floor(random() * 800));

    const stop = await getStop(page);
    expect(stop).toBeGreaterThanOrEqual(STOP.welcome);
    expect(stop).toBeLessThanOrEqual(MAX_STOP);
  }

  await waitForSettled(page);
  await expectConsistentState(page);
  await expectStillResponsive(page);
});

test("changing the destination mid-flight lands on the last one", async ({
  page,
}) => {
  await seedSettings(page);
  await startExperience(page);

  await chapterButton(page, "Contact").click();
  await page.waitForTimeout(700);
  await chapterButton(page, "Experience").click();
  await page.waitForTimeout(300);
  await chapterButton(page, "Certificates").click();
  await expectStop(page, STOP.certificatesList);

  // And straight back home while flying
  await chapterButton(page, "Contact").click();
  await page.waitForTimeout(1000);
  await page.keyboard.press("Home");
  await expectStop(page, STOP.welcome);

  await expectStillResponsive(page);
});

test("resizing the window during a flight and between stops", async ({
  page,
}) => {
  await seedSettings(page);
  await startExperience(page);

  const sizes = [
    { width: 1280, height: 720 },
    { width: 800, height: 1100 },
    { width: 2560, height: 1080 },
    { width: 1024, height: 600 },
    { width: 1920, height: 1080 },
  ];
  for (const size of sizes) {
    await step(page, 1, "keyboard");
    await page.waitForTimeout(400);
    await page.setViewportSize(size);
    await waitForSettled(page);

    // The navigation stays on screen at every size
    const nav = await page
      .getByRole("navigation", { name: "Sections" })
      .boundingBox();
    expect(nav!.x).toBeGreaterThanOrEqual(0);
    expect(nav!.x + nav!.width).toBeLessThanOrEqual(size.width);
    expect(nav!.y + nav!.height).toBeLessThanOrEqual(size.height);
  }

  expect(await getStop(page)).toBe(sizes.length);
  await expectConsistentState(page);
});

test("reloading mid-flight shows the start menu again and works", async ({
  page,
}) => {
  await seedSettings(page);
  await startExperience(page);
  await chapterButton(page, "Projects").click();
  await page.waitForTimeout(1000);

  await page.reload();
  await expect(startButton(page)).toBeEnabled({ timeout: 60_000 });
  await startButton(page).click();
  await expect(page.locator(".startup-panel")).toBeHidden({ timeout: 30_000 });
  await expect(page.locator("[data-scroll-progress]")).toHaveAttribute(
    "data-scroll-input-ready",
    "true",
    { timeout: 30_000 }
  );
  await expectStop(page, STOP.welcome);
  await expectStillResponsive(page);
});

test("clicking START many times starts only once", async ({ page }) => {
  await seedSettings(page);
  await page.goto("/");
  const start = startButton(page);
  await expect(start).toBeEnabled({ timeout: 60_000 });

  await start.click();
  // Disabled right away, further clicks hit nothing
  await expect(start).toBeDisabled();
  await page.mouse.click(960, 600);
  await page.mouse.click(960, 600);
  await page.keyboard.press("Enter");

  await expect(page.locator(".startup-panel")).toBeHidden({ timeout: 30_000 });
  await expect(page.locator("[data-scroll-progress]")).toHaveAttribute(
    "data-scroll-input-ready",
    "true",
    { timeout: 30_000 }
  );
  await expectStop(page, STOP.welcome);
});

test("an open dialog blocks the experience from scrolling behind it", async ({
  page,
}) => {
  await seedSettings(page);
  await startExperience(page);

  await page.getByRole("button", { name: "Credits" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await page.keyboard.press("ArrowDown");
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(800);
  expect(await getStop(page)).toBe(STOP.welcome);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.keyboard.press("ArrowDown");
  await expectStop(page, STOP.welcomeCloseup);
});

test.describe("touch chaos", () => {
  test.use({
    viewport: { width: 844, height: 390 },
    hasTouch: true,
    isMobile: true,
  });

  test("rapid swipes in both directions", async ({ page }) => {
    await seedSettings(page);
    await startExperience(page, { via: "tap" });

    for (let i = 0; i < 12; i++) await swipe(page, i % 4 === 3 ? -1 : 1);
    await waitForSettled(page);
    await expectConsistentState(page);

    // Rotating the phone
    await page.setViewportSize({ width: 390, height: 844 });
    await waitForSettled(page);
    await swipe(page, 1);
    await waitForSettled(page);
    await expectConsistentState(page);
  });
});
