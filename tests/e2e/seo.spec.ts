import { expect, test } from "@playwright/test";

test("route navigation updates canonical and social metadata", async ({ page }) => {
  await page.goto("/insights/from-ai-pilot-to-practical-value?campaign=test#article", {
    waitUntil: "domcontentloaded",
  });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "From AI pilot to practical value",
    }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page).toHaveTitle(/From AI pilot to practical value \| SENZOFT/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "A practical guide to turning AI experiments into useful, owned workflows.",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.senzoft.com/insights/from-ai-pilot-to-practical-value",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://www.senzoft.com/insights/from-ai-pilot-to-practical-value",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\/www\.senzoft\.com\//);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "2172");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

  const jsonLd = await page.locator('script[data-seo-jsonld="true"]').allTextContents();
  expect(jsonLd.some((value) => JSON.parse(value)["@type"] === "Article")).toBeTruthy();
  expect(jsonLd.some((value) => JSON.parse(value)["@type"] === "BreadcrumbList")).toBeTruthy();

  const visibleBreadcrumbs = await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("listitem").allTextContents();
  const breadcrumbJson = jsonLd.map((value) => JSON.parse(value)).find((value) => value["@type"] === "BreadcrumbList");
  expect(visibleBreadcrumbs).toHaveLength(breadcrumbJson.itemListElement.length);
});

test("utility and error routes are excluded from indexing", async ({ page }) => {
  await page.goto("/search", { waitUntil: "domcontentloaded" });
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");

  await page.goto("/route-that-does-not-exist", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle("Page not found | SENZOFT");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});
