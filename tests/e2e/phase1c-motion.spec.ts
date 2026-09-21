import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("senzoft-cookie-consent", "declined"));
});

test("reduced motion keeps content visible and pauses decorative movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/careers/openings/frontend-01");
  await expect(page.locator("html")).toHaveAttribute("data-effects", "paused");
  await expect(page.getByRole("heading", { name: "Frontend Engineer", exact: true })).toBeVisible();
  const styles = await page.evaluate(() => ({
    mainOpacity: getComputedStyle(document.querySelector("main")!).opacity,
    mainTransform: getComputedStyle(document.querySelector("main")!).transform,
    orbAnimation: getComputedStyle(document.querySelector(".career-hero-ball")!).animationName,
  }));
  expect(styles).toEqual({ mainOpacity: "1", mainTransform: "none", orbAnimation: "none" });
});

test("desktop, tablet and mobile retain readable section rhythm without horizontal overflow", async ({ page }) => {
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/services");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      sectionSpace: getComputedStyle(document.querySelector("main section.section")!).paddingTop,
      mainOpacity: getComputedStyle(document.querySelector("main")!).opacity,
    }));
    expect(metrics.overflow, `${width}px horizontal overflow`).toBe(false);
    expect(parseFloat(metrics.sectionSpace)).toBeGreaterThanOrEqual(40);
    expect(metrics.mainOpacity).toBe("1");
  }
});

test("scroll reveal appears when approached and does not stack on Framer Reveal", async ({ page }) => {
  await page.goto("/");
  const reveal = page.locator(".scroll-reveal-item").first();
  await expect(reveal).toHaveCount(1);
  await expect(page.locator("[data-motion-reveal] .scroll-reveal-item")).toHaveCount(0);
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveClass(/scroll-entered/);
  await expect(reveal).toHaveCSS("opacity", "1");
});
