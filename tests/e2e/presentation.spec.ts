import { expect, test } from "@playwright/test";

test("shared enterprise sections use designed layouts instead of plain document flow", async ({ page }) => {
  await page.goto("/services");
  const taxonomy = page.locator(".reference-details");
  await taxonomy.scrollIntoViewIfNeeded();
  await expect(taxonomy.locator(".reference-columns a").first()).toHaveCSS("color", "rgb(37, 49, 74)");
  const priorities = page.locator(".priority-tabs");
  await priorities.scrollIntoViewIfNeeded();
  await expect(priorities).toBeVisible();
  await expect(priorities).toHaveCSS("display", "grid");
  await expect(page.locator(".priority-story")).toHaveCSS("display", "grid");

  await page.goto("/who-we-are");
  const values = page.locator(".reference-value-grid");
  await values.scrollIntoViewIfNeeded();
  await expect(values).toBeVisible();
  await expect(values).toHaveCSS("display", "grid");
  await expect(values.locator(".reference-value-card").first()).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("shared presentation remains stacked and readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/services");
  const story = page.locator(".priority-story");
  await story.scrollIntoViewIfNeeded();
  await expect(story).toBeVisible();
  expect((await story.evaluate((element) => getComputedStyle(element).gridTemplateColumns)).split(" ")).toHaveLength(1);
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
});
