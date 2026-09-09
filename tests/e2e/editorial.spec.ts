import { expect, test } from "@playwright/test";

test("industry pages connect to detailed software solutions", async ({
  page,
}) => {
  await page.goto("/industries/healthcare");
  const heading = page.getByRole("heading", {
    name: "Simpler patient administration",
  });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  await page
    .locator("main")
    .getByRole("link", { name: /Website & Web Application Development/ })
    .click();
  await expect(page).toHaveURL(
    /services\/digital-engineering\/web-development$/,
  );
  await page.getByRole("link", { name: "What we do", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Corporate websites", exact: true }),
  ).toBeInViewport();
});

test("reduced motion preserves the video poster without playback buttons", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const videos: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) videos.push(request.url());
  });
  await page.goto("/");
  const panel = page.locator(".video-panel").first();
  await panel.scrollIntoViewIfNeeded();
  await expect(panel.locator("img")).toBeVisible();
  await expect(panel.locator("video")).not.toHaveAttribute("src");
  expect(videos).toHaveLength(0);
  await expect(
    page.getByRole("button", { name: /play|pause|resume/i }),
  ).toHaveCount(0);
});

test("failed video preserves its poster and page content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/*.mp4", (route) => route.abort());
  await page.goto("/");
  const panel = page.locator(".video-panel").first();
  await panel.scrollIntoViewIfNeeded();
  await expect(panel.locator("video")).toHaveCount(0);
  await expect(panel.locator("img")).toBeVisible();
  await expect
    .poll(() =>
      panel
        .locator("img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
});

test("career filtering and site search remain usable", async ({ page }) => {
  await page.goto("/careers");
  await page
    .getByRole("combobox", { name: "Department" })
    .selectOption("Engineering");
  await expect(
    page.getByRole("heading", { name: "Frontend Engineer" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Business Analyst" }),
  ).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Search roles" })
    .fill("no-such-role");
  await expect(
    page.getByRole("heading", { name: "No matching roles" }),
  ).toBeVisible();
  await page.goto("/search");
  await page.getByRole("button", { name: "Cloud", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Cloud & Platforms", exact: true }),
  ).toBeVisible();
});
