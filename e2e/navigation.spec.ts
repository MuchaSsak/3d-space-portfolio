import {
  chapterButton,
  CHAPTERS,
  expect,
  expectStop,
  getStop,
  MAX_STOP,
  moveToNeighbourStop,
  seedSettings,
  startExperience,
  STOP,
  test,
} from "./fixtures";

/**
 * Going through the whole portfolio the way visitors do
 */
test.describe("full motion", () => {
  test("keyboard: step by step to the contact form and all the way back", async ({
    page,
  }) => {
    // 22 camera flights
    test.setTimeout(8 * 60_000);
    await seedSettings(page, { graphics: "high" });
    await startExperience(page);

    const inputsPerStop: number[] = [];
    for (let stop = STOP.welcome; stop < MAX_STOP; stop++)
      inputsPerStop.push(await moveToNeighbourStop(page, 1, "keyboard"));
    expect(await getStop(page)).toBe(MAX_STOP);

    // Only the scrollable certificates list and the projects carousel take extra inputs
    inputsPerStop.forEach((inputs, fromStop) => {
      if (fromStop !== STOP.certificatesList && fromStop !== STOP.projectsList)
        expect(inputs, `inputs to leave stop ${fromStop}`).toBe(1);
    });

    // The contact form is shown at the end
    await expect(page.getByText("Your message").first()).toBeVisible();

    for (let stop = MAX_STOP; stop > STOP.welcome; stop--)
      await moveToNeighbourStop(page, -1, "keyboard");
    expect(await getStop(page)).toBe(STOP.welcome);
  });

  test("mouse wheel: through every stop and back", async ({ page }) => {
    test.setTimeout(8 * 60_000);
    await seedSettings(page);
    await startExperience(page);

    for (let stop = STOP.welcome; stop < MAX_STOP; stop++)
      await moveToNeighbourStop(page, 1, "wheel");
    expect(await getStop(page)).toBe(MAX_STOP);

    for (let stop = MAX_STOP; stop > STOP.welcome; stop--)
      await moveToNeighbourStop(page, -1, "wheel");
  });

  test("one long trackpad-like wheel gesture moves only one stop", async ({
    page,
  }) => {
    await seedSettings(page);
    await startExperience(page);

    // Small wheel deltas every frame for ~0.6s, like trackpad inertia. Dispatched in the page, as sequential
    // Playwright wheel calls get spread over seconds on a busy machine, which no trackpad does.
    await page.evaluate(async () => {
      const target = document.elementFromPoint(960, 900)!;
      for (let i = 0; i < 40; i++) {
        target.dispatchEvent(
          new WheelEvent("wheel", { deltaY: 40, bubbles: true })
        );
        await new Promise((resolve) => setTimeout(resolve, 16));
      }
    });
    await expectStop(page, STOP.welcomeCloseup);
    await page.waitForTimeout(1500);
    expect(await getStop(page)).toBe(STOP.welcomeCloseup);
  });

  test("chapter buttons jump to their planet from anywhere", async ({
    page,
  }) => {
    await seedSettings(page);
    await startExperience(page);

    // Forwards, backwards and over several chapters at once
    for (const label of [
      "Contact",
      "About",
      "Certificates",
      "Experience",
      "Projects",
      "About",
    ]) {
      const chapter = CHAPTERS.find((chapter) => chapter.label === label)!;
      await chapterButton(page, label).click();
      await expectStop(page, chapter.target);
      await expect(chapterButton(page, label)).toHaveAttribute(
        "aria-current",
        "step"
      );
    }
  });

  test("Hire me flies to the contact form", async ({ page }) => {
    await seedSettings(page);
    await startExperience(page);

    await page.getByRole("button", { name: "Hire me" }).click();
    await expectStop(page, STOP.contact);
    await expect(page.getByText("Your message").first()).toBeVisible();
  });

  test("Home, End and the left/right arrow keys", async ({ page }) => {
    await seedSettings(page);
    await startExperience(page);

    await page.keyboard.press("End");
    await expectStop(page, MAX_STOP);
    await page.keyboard.press("Home");
    await expectStop(page, STOP.welcome);
    await page.keyboard.press("ArrowRight");
    await expectStop(page, STOP.welcomeCloseup);
    await page.keyboard.press("ArrowLeft");
    await expectStop(page, STOP.welcome);
    // Space and PageDown work like on a regular page
    await page.keyboard.press("Space");
    await expectStop(page, STOP.welcomeCloseup);
    await page.keyboard.press("PageDown");
    await expectStop(page, STOP.aboutMe);
    await page.keyboard.press("Shift+Space");
    await expectStop(page, STOP.welcomeCloseup);
  });

  test("nothing moves before the start, and at both ends", async ({ page }) => {
    await seedSettings(page);
    await page.goto("/");
    // Input on the start menu must not move the experience behind it
    await page.keyboard.press("ArrowDown");
    await page.mouse.wheel(0, 500);
    await startExperience(page);

    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(500);
    expect(await getStop(page)).toBe(STOP.welcome);

    await page.keyboard.press("End");
    await expectStop(page, MAX_STOP);
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(500);
    expect(await getStop(page)).toBe(MAX_STOP);
  });

  test("projects carousel: previous/next buttons and arrow keys", async ({
    page,
  }) => {
    await seedSettings(page);
    await startExperience(page);
    await chapterButton(page, "Projects").click();
    await expectStop(page, STOP.projectsList);

    const carousel = page.getByRole("group", { name: "Projects" });
    const counter = carousel.locator("p");
    const previous = carousel.getByRole("button", { name: "Previous project" });
    const next = carousel.getByRole("button", { name: "Next project" });
    await expect(counter).toHaveText(/^1\/\d+/);
    await expect(previous).toBeDisabled();
    const count = Number((await counter.innerText()).match(/\/(\d+)/)![1]);

    await next.click();
    await expect(counter).toHaveText(/^2\//);
    await previous.click();
    await expect(counter).toHaveText(/^1\//);

    // Left/right arrows browse the projects instead of leaving the section
    for (let i = 2; i <= count; i++) {
      // Input is ignored while the carousel rotates (550ms), so wheel momentum can't skip cards
      await page.waitForTimeout(600);
      await page.keyboard.press("ArrowRight");
      await expect(counter).toHaveText(new RegExp(`^${i}/`));
    }
    await expect(next).toBeDisabled();
    expect(await getStop(page)).toBe(STOP.projectsList);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("camera cuts instead of flights, still every stop is reachable", async ({
    page,
  }) => {
    await seedSettings(page);
    await startExperience(page);

    for (let stop = STOP.welcome; stop < MAX_STOP; stop++)
      await moveToNeighbourStop(page, 1, "keyboard");
    await page.keyboard.press("Home");
    await expectStop(page, STOP.welcome, 5000);
  });
});

test.describe("touch screen", () => {
  test.use({
    viewport: { width: 844, height: 390 },
    hasTouch: true,
    isMobile: true,
  });

  test("swiping up and down goes through the stops", async ({ page }) => {
    await seedSettings(page);
    await startExperience(page, { via: "tap" });

    for (let stop = STOP.welcome; stop < STOP.certificatesTitle; stop++)
      await moveToNeighbourStop(page, 1, "swipe");
    for (let stop = STOP.certificatesTitle; stop > STOP.welcome; stop--)
      await moveToNeighbourStop(page, -1, "swipe");
  });

  test("the idle hint offers previous/next buttons", async ({ page }) => {
    await seedSettings(page);
    await startExperience(page, { via: "tap" });

    const next = page.getByRole("button", { name: "Next section" });
    // Shown after a few seconds without input
    await expect(next).toBeVisible({ timeout: 15_000 });
    await next.tap();
    await expectStop(page, STOP.welcomeCloseup);

    const previous = page.getByRole("button", { name: "Previous section" });
    await expect(previous).toBeVisible({ timeout: 15_000 });
    await previous.tap();
    await expectStop(page, STOP.welcome);
  });

  test("chapters can be tapped and the contact form is usable", async ({
    page,
  }) => {
    await seedSettings(page);
    await startExperience(page, { via: "tap" });

    await chapterButton(page, "Contact").tap();
    await expectStop(page, MAX_STOP);
    const message = page.getByRole("textbox", { name: "Your message" });
    await expect(message).toBeVisible();
    await message.tap();
    await expect(message).toBeFocused();
  });
});
