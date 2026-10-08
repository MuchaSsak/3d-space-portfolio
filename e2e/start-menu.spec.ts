import type { Locator, Page } from "@playwright/test";

import {
  expect,
  seedSettings,
  startButton,
  startExperience,
  test,
} from "./fixtures";

const viewports = [
  { name: "small phone portrait", width: 360, height: 640, touch: true },
  { name: "phone portrait", width: 390, height: 844, touch: true },
  { name: "small phone landscape", width: 667, height: 375, touch: true },
  { name: "phone landscape", width: 844, height: 390, touch: true },
  { name: "tablet portrait", width: 768, height: 1024, touch: true },
  { name: "tablet landscape", width: 1024, height: 768, touch: true },
  { name: "laptop 720p", width: 1280, height: 720, touch: false },
  { name: "laptop 768p", width: 1366, height: 768, touch: false },
  { name: "macbook", width: 1440, height: 900, touch: false },
  { name: "full hd", width: 1920, height: 1080, touch: false },
  { name: "short and wide window", width: 1920, height: 600, touch: false },
  { name: "tall and narrow window", width: 800, height: 1280, touch: false },
  { name: "ultrawide", width: 3440, height: 1440, touch: false },
  { name: "4k", width: 3840, height: 2160, touch: false },
];

type Box = { x: number; y: number; width: number; height: number };

async function getBox(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  expect(box, "element is rendered").not.toBeNull();
  return box!;
}

function expectInsideViewport(page: Page, box: Box, what: string) {
  const { width, height } = page.viewportSize()!;
  expect(box.x, `${what} left edge`).toBeGreaterThanOrEqual(0);
  expect(box.y, `${what} top edge`).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width, `${what} right edge`).toBeLessThanOrEqual(width);
  expect(box.y + box.height, `${what} bottom edge`).toBeLessThanOrEqual(height);
}

function overlaps(a: Box, b: Box) {
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  );
}

// The element actually receiving a click in the middle of the control, nothing may cover it
async function expectClickable(locator: Locator, what: string) {
  const isOnTop = await locator.evaluate((el) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    const hit = document.elementFromPoint(left + width / 2, top + height / 2);
    return !!hit && (hit === el || el.contains(hit));
  });
  expect(isOnTop, `${what} is not covered by anything`).toBe(true);
}

for (const viewport of viewports)
  test.describe(`${viewport.name} ${viewport.width}x${viewport.height}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.touch,
      isMobile: viewport.touch && viewport.width < 900,
    });

    for (const language of ["en", "pl"] as const)
      test(`start menu fits the screen (${language})`, async ({ page }) => {
        await seedSettings(page, { language });
        await page.goto("/");

        const start = startButton(page);
        // Locale independent: the START label is the same in every language
        await expect(start).toBeEnabled({ timeout: 60_000 });
        // The settings buttons fade in
        await page.waitForTimeout(6000);

        const panel = page.locator(".startup-panel");
        // Also matches the graphics select, its trigger is a button with the combobox role
        const settingsButtons = panel.locator("button").filter({
          hasNot: page.getByText("START", { exact: true }),
        });
        await expect(settingsButtons).toHaveCount(3);

        const header = await getBox(page.locator("header").first());
        const footer = await getBox(
          page.getByRole("link", { name: "muszarski.com" }).locator("..")
        );
        const privacy = await getBox(
          page.getByRole("link", { name: /privacy|prywatności/i })
        );
        expectInsideViewport(page, header, "header");
        expectInsideViewport(page, footer, "footer text");
        expectInsideViewport(page, privacy, "privacy policy link");

        const controls: [string, Box][] = [["START", await getBox(start)]];
        for (let i = 0; i < 3; i++)
          controls.push([
            (await settingsButtons.nth(i).innerText()).trim(),
            await getBox(settingsButtons.nth(i)),
          ]);

        for (const [name, box] of controls) {
          expectInsideViewport(page, box, name);
          expect(overlaps(box, header), `${name} overlaps the header`).toBe(
            false
          );
          expect(overlaps(box, footer), `${name} overlaps the footer`).toBe(
            false
          );
          expect(
            overlaps(box, privacy),
            `${name} overlaps the privacy link`
          ).toBe(false);
        }
        for (let i = 0; i < controls.length; i++)
          for (let j = i + 1; j < controls.length; j++)
            expect(
              overlaps(controls[i][1], controls[j][1]),
              `${controls[i][0]} overlaps ${controls[j][0]}`
            ).toBe(false);

        // Readable and hittable
        const startBox = controls[0][1];
        expect(
          startBox.height,
          "START is big enough to hit"
        ).toBeGreaterThanOrEqual(40);
        await expectClickable(start, "START");
        for (let i = 0; i < 3; i++)
          await expectClickable(
            settingsButtons.nth(i),
            `settings button ${i + 1}`
          );
        const labelFontSize = await settingsButtons
          .first()
          .evaluate(
            (el) =>
              (parseFloat(getComputedStyle(el).fontSize) *
                el.getBoundingClientRect().width) /
              (el as HTMLElement).offsetWidth
          );
        expect(
          labelFontSize,
          "settings labels are readable"
        ).toBeGreaterThanOrEqual(10);

        // The page itself never scrolls
        const scrollSize = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        }));
        expect(scrollSize.width).toBeLessThanOrEqual(viewport.width);
        expect(scrollSize.height).toBeLessThanOrEqual(viewport.height);
      });
  });

test("START is focused and Enter starts the experience", async ({ page }) => {
  await seedSettings(page);
  await startExperience(page, { via: "keyboard" });
});

test.describe("phone", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test("every settings popover opens inside the screen", async ({ page }) => {
    await seedSettings(page);
    await page.goto("/");
    await expect(startButton(page)).toBeEnabled({ timeout: 60_000 });
    await page.waitForTimeout(6000);

    for (const name of ["Language", "Graphics", "Sounds"]) {
      // The graphics select is a combobox, so match by the visible label
      await page
        .locator(".startup-panel button")
        .filter({ hasText: name })
        .tap();
      const popover = page.locator(
        "[data-radix-popper-content-wrapper] > *:visible"
      );
      await expect(popover).toBeVisible();
      expectInsideViewport(page, await getBox(popover), `${name} popover`);
      await page.keyboard.press("Escape");
      await expect(popover).toBeHidden();
    }
  });
});

test("switching the language on the start menu translates it and is remembered", async ({
  page,
}) => {
  await seedSettings(page);
  await page.goto("/");
  await expect(startButton(page)).toBeEnabled({ timeout: 60_000 });
  await page.waitForTimeout(6000);

  await page
    .locator(".startup-panel")
    .getByRole("button", { name: "Language" })
    .click();
  await page.getByRole("option", { name: /Polski/ }).click();
  await expect(
    page.locator(".startup-panel").getByRole("button", { name: "Język" })
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");

  await page.reload();
  await expect(
    page.locator(".startup-panel").getByRole("button", { name: "Język" })
  ).toBeVisible({ timeout: 60_000 });
});
