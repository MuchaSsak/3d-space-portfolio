import type { Page } from "@playwright/test";

import {
  EMAIL_API_URL,
  expect,
  expectStop,
  seedSettings,
  startExperience,
  STOP,
  test,
} from "./fixtures";

async function openContactForm(page: Page) {
  await seedSettings(page);
  await startExperience(page);
  await page.keyboard.press("End");
  await expectStop(page, STOP.contact);

  return {
    message: page.getByRole("textbox", { name: "Your message" }),
    email: page.getByRole("textbox", { name: /Where do I reply/ }),
    send: page.getByRole("button", { name: "Send message" }),
  };
}

test("validates the fields before sending", async ({ page, sentEmails }) => {
  const { message, email, send } = await openContactForm(page);

  await send.click();
  await expect(
    page.getByText("Message must be at least 3 characters long.")
  ).toBeVisible();
  await expect(
    page.getByText("Please enter your email, so I can reply.")
  ).toBeVisible();

  await message.fill("Hi");
  await email.fill("not-an-email");
  await send.click();
  await expect(page.getByText("This email doesn't look right.")).toBeVisible();
  expect(sentEmails).toHaveLength(0);
});

test("typing in the form never moves the camera", async ({ page }) => {
  const { message } = await openContactForm(page);

  await message.click();
  // Keys that navigate the experience elsewhere
  await message.pressSequentially("Space Home End ArrowUp");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Home");
  await page.keyboard.press("Space");
  await page.waitForTimeout(800);
  await expectStop(page, STOP.contact);
  await expect(message).toHaveValue(/Space Home End ArrowUp/);
});

test("sends the message and confirms it", async ({ page }) => {
  const requests: Record<string, any>[] = [];
  await page.route(EMAIL_API_URL, (route) => {
    requests.push(route.request().postDataJSON());
    return route.fulfill({ status: 200, body: "OK" });
  });
  const { message, email, send } = await openContactForm(page);

  await page.getByText("A project", { exact: true }).click();
  await message.fill("We'd like a 3D landing page for our product launch.");
  await email.fill("  someone@example.com ");
  await send.click();

  await expect(page.getByText("Sent. Thank you!").first()).toBeVisible();
  await expect(
    page.getByText("I'll reply to someone@example.com.")
  ).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0].template_params.reply_to).toBe("someone@example.com");
  expect(requests[0].template_params.subject).toContain("A project");
  expect(requests[0].template_params.message).toContain("3D landing page");
});

test("a failed send tells where to write instead", async ({ page }) => {
  const { message, email, send } = await openContactForm(page);

  await message.fill("Hello there, this will fail.");
  await email.fill("someone@example.com");
  await send.click();

  await expect(
    page.getByText(/Something went wrong with sending the message/)
  ).toBeVisible();
  // What was written is kept for another try
  await expect(message).toHaveValue("Hello there, this will fail.");
  await expect(send).toBeEnabled();
});

test("bots filling the hidden field are not sent through", async ({
  page,
  sentEmails,
}) => {
  const { message, email, send } = await openContactForm(page);

  await message.fill("Buy cheap stuff");
  await email.fill("bot@example.com");
  await page
    .locator('input[name="contactFaxNumber"]')
    .fill("123456", { force: true });
  await send.click();

  await expect(page.getByText("Sent. Thank you!").first()).toBeVisible();
  expect(sentEmails).toHaveLength(0);
});
