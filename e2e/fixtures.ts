import { expect, type Page, test as base } from "@playwright/test";

// Mirrors src/lib/sections.ts
export const STOP = {
  welcome: 0,
  welcomeCloseup: 1,
  aboutMe: 2,
  myOrigin: 3,
  experienceTitle: 4,
  experienceList: 5,
  downloadResume: 6,
  certificatesTitle: 7,
  certificatesList: 8,
  projectsTitle: 9,
  projectsList: 10,
  contact: 11,
} as const;
export const MAX_STOP = STOP.contact;

export const CHAPTERS = [
  { label: "About", target: STOP.aboutMe, range: [0, 3] },
  { label: "Experience", target: STOP.experienceList, range: [4, 6] },
  { label: "Certificates", target: STOP.certificatesList, range: [7, 8] },
  { label: "Projects", target: STOP.projectsList, range: [9, 10] },
  { label: "Contact", target: STOP.contact, range: [11, 11] },
] as const;

type SeedOptions = {
  graphics?: "low" | "high";
  language?: "en" | "pl";
  // The small screens notice is skipped unless a test is about it
  hasIgnoredMobileWarning?: boolean;
};

/**
 * Stores the settings a returning visitor would have, before any page script runs
 */
export async function seedSettings(page: Page, options: SeedOptions = {}) {
  const {
    graphics = "low",
    language = "en",
    hasIgnoredMobileWarning = true,
  } = options;

  await page.addInitScript(
    ({ graphics, language, hasIgnoredMobileWarning }) => {
      // Only on the first load, so reload tests see what the app itself saved
      if (sessionStorage.getItem("e2e-seeded")) return;
      sessionStorage.setItem("e2e-seeded", "1");
      localStorage.setItem(
        "settings",
        JSON.stringify({
          graphicsPresetValue: graphics,
          isAudioEnabled: false,
          audioVolume: 0,
          hasIgnoredMobileWarning,
        })
      );
      localStorage.setItem("language", JSON.stringify(language));
    },
    { graphics, language, hasIgnoredMobileWarning }
  );
}

export function startButton(page: Page) {
  return page.locator(".startup-panel").getByRole("button", { name: "START" });
}

function navigation(page: Page) {
  return page.locator("[data-scroll-progress]");
}

export function chapterButton(page: Page, label: string) {
  return page
    .getByRole("navigation", { name: "Sections" })
    .getByRole("button", { name: label });
}

export async function getStop(page: Page) {
  return Number(await navigation(page).getAttribute("data-scroll-progress"));
}

// Flights last up to 8 seconds, but are timed by GSAP: when a frame takes over 500ms (shader compilation on the
// first visit of a planet, a busy GPU) it advances only 33ms, so under load a flight can take several times longer
const FLIGHT_TIMEOUT = 45_000;

/**
 * Waits until the camera has arrived and the experience accepts input again
 */
export async function waitForSettled(page: Page, timeout = FLIGHT_TIMEOUT) {
  await expect(navigation(page)).toHaveAttribute(
    "data-scrolling-paused",
    "false",
    { timeout }
  );
}

export async function expectStop(
  page: Page,
  stop: number,
  timeout = FLIGHT_TIMEOUT
) {
  await expect(navigation(page)).toHaveAttribute(
    "data-scroll-progress",
    String(stop),
    { timeout }
  );
  await waitForSettled(page, timeout);
}

/**
 * Opens the page and goes through the startup screen
 */
export async function startExperience(
  page: Page,
  { via = "click" }: { via?: "click" | "tap" | "keyboard" } = {}
) {
  await page.goto("/");
  const start = startButton(page);
  await expect(start).toBeEnabled({ timeout: 60_000 });

  if (via === "keyboard") {
    // The START button is focused once everything is loaded
    await expect(start).toBeFocused();
    await page.keyboard.press("Enter");
  } else if (via === "tap") await start.tap();
  else await start.click();

  // The startup screen closes behind the doors, then input is accepted
  await expect(page.locator(".startup-panel")).toBeHidden({ timeout: 30_000 });
  await expect(navigation(page)).toHaveAttribute(
    "data-scroll-input-ready",
    "true",
    { timeout: 30_000 }
  );
  await expectStop(page, STOP.welcome);
}

/**
 * One deliberate "next"/"previous" with the given input method
 */
export async function step(
  page: Page,
  direction: 1 | -1,
  via: "keyboard" | "wheel" | "swipe"
) {
  const { width, height } = page.viewportSize()!;

  if (via === "keyboard")
    await page.keyboard.press(direction > 0 ? "ArrowDown" : "ArrowUp");
  else if (via === "wheel") {
    // Away from the side panels, so the wheel isn't taken by a scrollable list
    await page.mouse.move(width / 2, height * 0.85);
    await page.mouse.wheel(0, direction * 200);
  } else await swipe(page, direction);
}

/**
 * A quick vertical swipe, swiping up moves forward like scrolling a page
 */
export async function swipe(page: Page, direction: 1 | -1) {
  const { width, height } = page.viewportSize()!;
  const cdp = await page.context().newCDPSession(page);
  const x = Math.round(width / 2);
  const fromY = Math.round(height * (direction > 0 ? 0.7 : 0.3));
  const distance = Math.round(height * 0.35) * -direction;

  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y: fromY }],
  });
  for (let i = 1; i <= 5; i++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: fromY + Math.round((distance * i) / 5) }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await cdp.detach();
}

/**
 * Moves one stop in the given direction, also through the stops that first consume the input themselves
 * (the scrollable certificates list, the projects carousel). Returns how many inputs it took.
 */
export async function moveToNeighbourStop(
  page: Page,
  direction: 1 | -1,
  via: "keyboard" | "wheel" | "swipe",
  maxInputs = 25
) {
  const from = await getStop(page);

  for (let inputs = 1; inputs <= maxInputs; inputs++) {
    await step(page, direction, via);
    // A wheel gesture ends after a short pause, the next one must not be merged into it
    await page.waitForTimeout(via === "keyboard" ? 150 : 350);

    const stop = await getStop(page);
    if (stop !== from) {
      expect(stop, `one input moves exactly one stop`).toBe(from + direction);
      await waitForSettled(page);
      return inputs;
    }
    // The input was taken by a list or carousel, wait until it's done animating
    await waitForSettled(page);
  }

  throw new Error(
    `Could not move from stop ${from} in direction ${direction} with ${via}`
  );
}

export const EMAIL_API_URL = "https://api.emailjs.com/**";

type Fixtures = {
  // Requests that would have sent an email, tests can answer them with page.route()
  sentEmails: Record<string, unknown>[];
  consoleErrors: string[];
};

export const test = base.extend<Fixtures>({
  /**
   * Tests never send real emails: the email API is answered with a failure unless a test mocks it
   */
  sentEmails: [
    async ({ context }, use) => {
      const sentEmails: Record<string, unknown>[] = [];
      await context.route(EMAIL_API_URL, (route) => {
        sentEmails.push(route.request().postDataJSON());
        return route.fulfill({ status: 503, body: "Blocked in tests" });
      });

      await use(sentEmails);
    },
    { auto: true },
  ],

  /**
   * Fails the test on uncaught errors and React/Three errors in the console
   */
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) =>
        errors.push(`pageerror: ${error.message}`)
      );
      page.on("console", (message) => {
        const text = message.text();
        // The browser logs failed (mocked) email requests itself
        const isEmailApiResponse = message
          .location()
          .url.startsWith("https://api.emailjs.com");
        if (message.type() === "error" && !isEmailApiResponse)
          errors.push(`console.error: ${text}`);
        // Shader compilation problems are only warnings in Three.js
        if (/THREE\.WebGLProgram|Shader Error|WebGL context lost/i.test(text))
          errors.push(`webgl: ${text}`);
      });

      await use(errors);

      expect(errors, "no errors in the console").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
