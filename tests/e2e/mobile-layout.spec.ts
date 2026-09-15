import { test, expect } from "@playwright/test";

const routes = ["/", "/services", "/industries", "/technology", "/solutions", "/who-we-are", "/careers", "/insights", "/services/digital-engineering", "/technology/data-engineering"];

for (const route of routes) {
  test(`mobile layout stays within viewport: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.evaluate(() => localStorage.setItem("senzoft-cookie-consent", "declined"));
    await page.reload();
    await page.waitForTimeout(850);
    const overflow = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("main *, footer *")]
      .filter((el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return s.position !== "fixed" && r.width > 0 && (r.left < -2 || r.right > innerWidth + 2); })
      .slice(0, 12).map((el) => ({ tag: el.tagName, cls: el.className, left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right), width: Math.round(el.getBoundingClientRect().width) })));
    expect(overflow, JSON.stringify(overflow, null, 2)).toEqual([]);
  });
}
