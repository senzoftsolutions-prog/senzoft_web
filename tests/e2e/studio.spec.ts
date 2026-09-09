import { expect, test } from "@playwright/test";

test("hero model, capability explorer and delivery stages respond to selection", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("group", { name: "Explore the engineering model" })
    .getByRole("button", { name: "Connect" })
    .click();
  await expect(
    page.getByText("Information with a clear purpose", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("group", { name: "Choose a capability" })
    .getByRole("button", { name: /Data & AI/ })
    .click();
  const detail = page.locator(".capability-detail");
  await expect(
    detail.getByRole("heading", { name: "Data & AI", exact: true }),
  ).toBeVisible();
  await expect(
    detail.getByText("Data governance", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("group", { name: "Delivery stages" })
    .getByRole("button", { name: /Evolve/ })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Make launch the start of useful learning.",
    }),
  ).toBeVisible();
  await detail.getByRole("link", { name: "Explore Data & AI" }).click();
  await expect(page).toHaveURL(/\/services\/data-ai$/);
});

test("scroll reveals show content and navigation contains the five requested sections", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary", exact: true });
  await expect(nav.getByRole("link")).toHaveText([
    "About Us",
    "Services",
    "Industries",
    "Careers",
    "Contact Us",
  ]);
  const section = page.locator(".readiness-section > .container-shell");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveClass(/scroll-entered/);
  await expect(section.getByRole("heading")).toBeVisible();
  await expect(page.locator('a[href*="/insights"]')).toHaveCount(0);
});

test("device reduced-motion preference disables ambient effects", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-effects", "paused");
  await expect(
    page.getByRole("button", { name: /pause|resume|play/i }),
  ).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
