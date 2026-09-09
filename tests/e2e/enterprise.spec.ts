import { expect, test } from "@playwright/test";

test("business priorities connect challenges to the relevant service", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("group", { name: "Choose a business priority" })
    .getByRole("button", { name: /Make data useful/ })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Give decisions a dependable foundation.",
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Explore data and AI", exact: true })
    .click();
  await expect(page).toHaveURL(/\/services\/data-ai$/);
  await expect(
    page.getByRole("heading", {
      name: "Information that supports a decision you can explain.",
    }),
  ).toBeVisible();
});

test("readiness checklist supports selection and correction", async ({
  page,
}) => {
  await page.goto("/");
  const checklist = page.locator(".readiness-list");
  const boxes = checklist.getByRole("checkbox");
  for (let i = 0; i < 4; i++) await boxes.nth(i).check();
  await expect(page.locator(".readiness-count")).toContainText(
    "Your starting brief has the core ingredients.",
  );
  await boxes.first().uncheck();
  await expect(page.locator(".readiness-count")).toContainText("3 / 4");
});
