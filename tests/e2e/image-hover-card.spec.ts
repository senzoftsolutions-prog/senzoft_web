import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("senzoft-cookie-consent", "declined"));
});

test("image cards reveal a reversible panel on desktop hover", async ({ page }) => {
  for (const width of [1280, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/services");
    const card = page.locator(".image-hover-card").first();
    const panel = card.locator(".image-hover-card-panel");
    await expect(card).toBeVisible();
    await expect(card.locator(".image-hover-card-media img")).toBeVisible();

    const closedTransform = await panel.evaluate((element) => getComputedStyle(element).transform);
    expect(closedTransform).not.toBe("none");

    await card.scrollIntoViewIfNeeded();
    await card.hover({ position: { x: 20, y: 20 } });
    await expect.poll(() => card.evaluate((element) => element.matches(":hover"))).toBe(true);
    await expect.poll(() => panel.evaluate((element) => getComputedStyle(element).transform)).toMatch(/matrix\(1, 0, 0, 1, 0, 0\)|none/);

    await page.mouse.move(8, 8);
    await expect.poll(() => panel.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  }
});

test("image cards stay stacked for touch layouts", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/services");
  const card = page.locator(".image-hover-card").first();
  const panel = card.locator(".image-hover-card-panel");

  await expect(card).toBeVisible();
  await expect(panel).toHaveCSS("transform", "none");
  await expect(card.locator(".image-hover-card-media img")).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});