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
    await page.keyboard.press("Enter");
    await expect(page.locator("#desktop-mega-menu")).toHaveClass(/is-open/);
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#desktop-mega-menu a").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("#desktop-mega-menu")).not.toHaveClass(/is-open/);
    await page.keyboard.press("Space");
    await expect(page.locator("#desktop-mega-menu")).toHaveClass(/is-open/);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Industries", exact: true })).toBeFocused();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.getByRole("button", { name: "Open navigation" }).click();
    const mobileServices = page.locator("#mobile-navigation").getByRole("button", { name: "Services", exact: true });
    await mobileServices.click();
    await expect(mobileServices).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-services").getByRole("link", { name: /View all Services/ })).toBeVisible();
  });

  test("pointer can cross the header gap and switch menus without a second active item", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const services = page.getByRole("button", { name: "Services", exact: true });
    const technology = page.getByRole("button", { name: "Technology", exact: true });
    const panel = page.locator("#desktop-mega-menu");

    await services.hover();
    await expect(panel).toHaveClass(/is-open/);
    const triggerBox = await services.boundingBox();
    const panelBox = await panel.boundingBox();
    expect(triggerBox).not.toBeNull();
    expect(panelBox).not.toBeNull();
    await page.mouse.move(triggerBox!.x + triggerBox!.width / 2, triggerBox!.y + triggerBox!.height / 2);
    await page.mouse.move(panelBox!.x + 80, panelBox!.y + 30, { steps: 12 });
    await page.waitForTimeout(250);
    await expect(panel).toHaveClass(/is-open/);

    await technology.hover();
    await expect(technology).toHaveAttribute("aria-expanded", "true");
    await expect(services).toHaveAttribute("aria-expanded", "false");
    await expect(panel.getByRole("heading", { name: "Technology" })).toBeVisible();

    await page.getByRole("link", { name: "Insights", exact: true }).first().hover();
    await expect(panel).not.toHaveClass(/is-open/);
  });

  test("fast travel during opening intent reaches the menu without a lost hover", async ({ page }) => {
    for (const width of [1280, 1366, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const services = page.getByRole("button", { name: "Services", exact: true });
      const panel = page.locator("#desktop-mega-menu");
      const trigger = await services.boundingBox();
      const panelTop = await panel.evaluate((node) => node.getBoundingClientRect().top);
      expect(trigger).not.toBeNull();

      await page.mouse.move(trigger!.x + trigger!.width / 2, trigger!.y + trigger!.height / 2);
      await page.mouse.move(trigger!.x + trigger!.width / 2, panelTop + 42);
      await expect(panel, `fast hover at ${width}px`).toHaveClass(/is-open/);
      await expect(panel).toBeVisible();
      await page.waitForTimeout(250);
      await expect(panel).toHaveClass(/is-open/);
      await expect(services).toHaveAttribute("aria-expanded", "true");

      await page.mouse.move(width - 20, 700);
      await page.waitForTimeout(80);
      await expect(panel).toHaveClass(/is-open/);
      await expect(panel).not.toHaveClass(/is-open/);
    }
  });

  test("pending intent cancels cleanly outside and rapid menu switching keeps the shell open", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const panel = page.locator("#desktop-mega-menu");
    const services = page.getByRole("button", { name: "Services", exact: true });
    const technology = page.getByRole("button", { name: "Technology", exact: true });
    const industries = page.getByRole("button", { name: "Industries", exact: true });

    await services.hover();
    await page.mouse.move(1400, 700);
    await page.waitForTimeout(300);
    await expect(panel).not.toHaveClass(/is-open/);

    await services.hover();
    await expect(panel).toHaveClass(/is-open/);
    await technology.hover();
    await expect(panel.getByRole("heading", { name: "Technology" })).toBeVisible();
    await industries.hover();
    await expect(panel.getByRole("heading", { name: "Industries" })).toBeVisible();
    await services.hover();
    await technology.hover();
    await industries.hover();
    await expect(panel.getByRole("heading", { name: "Industries" })).toBeVisible();
    await expect(page.locator(".header-nav-item.mega-open")).toHaveCount(1);
    await page.mouse.move(1400, 700);
    await expect(panel).not.toHaveClass(/is-open/);
  });

  test("wide touch screens toggle the desktop menu by tap", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true });
    const page = await context.newPage();
    await page.goto("/");
    const services = page.getByRole("button", { name: "Services", exact: true });
    await services.tap();
    await expect(services).toHaveAttribute("aria-expanded", "true");
    await services.tap();
    await expect(services).toHaveAttribute("aria-expanded", "false");
    await context.close();
  });

  test("tablet drawer remains tap driven below the desktop breakpoint", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 768, height: 1024 }, hasTouch: true });
    const page = await context.newPage();
    for (const width of [768, 834]) {
      await page.setViewportSize({ width, height: 1024 });
      await page.goto("/");
      await page.getByRole("button", { name: "Open navigation" }).tap();
      const services = page.locator("#mobile-navigation").getByRole("button", { name: "Services", exact: true });
      await services.tap();
      await expect(services).toHaveAttribute("aria-expanded", "true");
      await page.getByRole("button", { name: "Close navigation" }).last().tap();
      await expect(page.locator(".mobile-nav-layer")).not.toHaveClass(/is-open/);
    }
    await context.close();
  });
});
