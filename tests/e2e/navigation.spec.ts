import { expect, test } from "@playwright/test";

test.describe("enterprise navigation", () => {
  test("desktop menus open precisely, switch in place, and close with Escape", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const services = page.getByRole("button", { name: "Services", exact: true });
    const industries = page.getByRole("button", { name: "Industries", exact: true });
    const panel = page.locator("#desktop-mega-menu");
    const mainOffset = await page.locator("main").evaluate((node) => (node as HTMLElement).offsetTop);

    await services.hover();
    await expect(panel).toHaveClass(/is-open/);
    await expect(services).toHaveAttribute("aria-expanded", "true");
    await industries.hover();
    await expect(panel.getByRole("heading", { name: "Industries" })).toBeVisible();
    expect(await page.locator("main").evaluate((node) => (node as HTMLElement).offsetTop)).toBe(mainOffset);

    await page.keyboard.press("Escape");
    await expect(panel).not.toHaveClass(/is-open/);
    await expect(industries).toBeFocused();
  });

  test("keyboard triggers and mobile accordion expose real destinations", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const services = page.getByRole("button", { name: "Services", exact: true });
    await services.focus();
    await expect(page.locator("#desktop-mega-menu")).toHaveClass(/is-open/);
    await expect(page.locator("#desktop-mega-menu").getByRole("link", { name: /Web Development/ })).toHaveAttribute("href", /services/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.getByRole("button", { name: "Open navigation" }).click();
    const mobileServices = page.locator("#mobile-navigation").getByRole("button", { name: "Services", exact: true });
    await mobileServices.click();
    await expect(mobileServices).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-services").getByRole("link", { name: /View all Services/ })).toBeVisible();
  });
});
