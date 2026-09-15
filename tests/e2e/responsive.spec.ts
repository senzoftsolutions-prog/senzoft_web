import { expect, test } from "@playwright/test";

const widths = [320, 360, 375, 390, 414, 430, 480, 768, 820, 834, 912, 1024, 1280, 1366, 1440, 1600, 1920, 2560];
const routes = ["/", "/services", "/industries", "/technology", "/solutions", "/who-we-are", "/insights", "/careers", "/contact"];

test("shared shell remains visible and overflow-free at every specified width", async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: Math.min(1200, Math.max(720, Math.round(width * .75))) });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const metrics = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
    }));
    expect(metrics.documentWidth, `document overflow at ${width}px`).toBeLessThanOrEqual(metrics.viewport + 1);
    expect(metrics.bodyWidth, `body overflow at ${width}px`).toBeLessThanOrEqual(metrics.viewport + 1);
    await expect(page.locator("main")).toBeVisible();
    if (width < 1024) {
      await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
      await expect(page.locator(".header-primary")).toBeHidden();
    } else {
      await expect(page.getByRole("button", { name: "Open navigation" })).toBeHidden();
      await expect(page.locator(".header-primary")).toBeVisible();
    }
  }
});

test("major journeys do not clip at phone, tablet, desktop, or ultra-wide", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");
      const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth);
      expect(overflow, `${route} overflows at ${width}px`).toBeLessThanOrEqual(1);
      await expect(page.locator("main")).toBeVisible();
    }
  }
});

test("mobile navigation behaves as a true overlay", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator(".mobile-nav-layer")).toHaveClass(/is-open/);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("navigation", { name: "Mobile primary" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-nav-layer")).not.toHaveClass(/is-open/);
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
});
