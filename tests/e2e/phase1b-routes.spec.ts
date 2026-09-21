import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("senzoft-cookie-consent", "declined"));
});

test("career search links reach the current role detail", async ({ page }) => {
  await page.goto("/search");
  const search = page.getByRole("textbox", { name: "Search site" });
  await search.fill("Frontend Engineer");
  await search.press("Enter");
  const role = page.locator('a[href="/careers/openings/frontend-01"]').first();
  await expect(role).toBeVisible();
  await role.click();
  await expect(page).toHaveURL(/\/careers\/openings\/frontend-01$/);
  await expect(page.getByRole("heading", { name: "Frontend Engineer", exact: true })).toBeVisible();
});

test("legacy career links resolve to the matching illustrative role", async ({ page }) => {
  await page.goto("/careers/business-analyst");
  await expect(page).toHaveURL(/\/careers\/openings\/analyst-01$/);
  await expect(page.getByRole("heading", { name: "Business Analyst", exact: true })).toBeVisible();
});

test("solution routes have a canonical parent and valid fallback", async ({ page }) => {
  await page.goto("/services/digital-engineering/web-development");
  await expect(page).toHaveURL(/\/services\/application-modernization\/web-development$/);
  await expect(page.getByRole("heading", { name: "Website & Web Application Development" })).toBeVisible();
  await page.goto("/services/data-ai/web-development");
  await expect(page.getByRole("heading", { name: "This idea took a wrong turn." })).toBeVisible();
});

test("related service, industry, technology, case study and insight details resolve", async ({ page }) => {
  const routes = [
    "/services/application-modernization",
    "/industries/logistics-transportation",
    "/technology/react",
    "/case-studies/connected-care-workflow",
    "/insights/designing-trusted-digital-services",
  ];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "This idea took a wrong turn." })).toHaveCount(0);
  }
  await page.goto("/careers/openings/unknown-role");
  await expect(page.getByRole("heading", { name: "Job not found" })).toBeVisible();
});
