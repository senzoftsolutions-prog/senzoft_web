import { expect, test } from "@playwright/test";
test("navigates the primary service journey", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Engineering the digital core/i }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Services", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/services$/);
  await page
    .getByRole("link", { name: /Explore/i })
    .first()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
test("sends the contact fields to the form endpoint", async ({ page }) => {
  let posted = "";
  await page.route("**/form-received.html", async (route) => {
    posted = route.request().postData() ?? "";
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "Received",
    });
  });
  await page.goto("/contact");
  await page.getByLabel("Name *").fill("Test User");
  await page.getByLabel("Work email *").fill("test@example.com");
  await page.getByLabel("Company *").fill("Example");
  await page
    .getByLabel("How can we help? *")
    .fill("We need a digital platform.");
  await page.getByText(/I consent/).click();
  await page.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(page.getByText(/Your enquiry has been sent/i)).toBeVisible();
  const payload = new URLSearchParams(posted);
  expect(payload.get("form-name")).toBe("contact");
  expect(payload.get("email")).toBe("test@example.com");
  expect(payload.get("consent")).toBe("true");
});
test("direct routes and 404 render", async ({ page }) => {
  await page.goto("/services/cybersecurity");
  await expect(
    page.getByRole("heading", { name: "Cybersecurity" }),
  ).toBeVisible();
  await page.goto("/not-a-route");
  await expect(page.getByText("404")).toBeVisible();
});

test("expanded navigation connects every service", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const menu = page.locator("#site-menu");
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole("link", { name: "Managed IT Services" }),
  ).toBeVisible();
  await menu.getByRole("link", { name: "Application Modernization" }).click();
  await expect(page).toHaveURL(/\/services\/application-modernization$/);
  await expect(
    page.getByRole("heading", {
      name: "Capabilities spanning strategy, build and scale.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Common questions")).toBeVisible();
});

test("a failed enquiry preserves the message and reports failure", async ({
  page,
}) => {
  await page.route("**/form-received.html", (route) =>
    route.fulfill({ status: 503, body: "Unavailable" }),
  );
  await page.goto("/contact");
  await page.getByLabel("Name *").fill("Test User");
  await page.getByLabel("Work email *").fill("test@example.com");
  await page.getByLabel("Company *").fill("Example");
  await page.getByLabel("How can we help? *").fill("A new application");
  await page.getByText(/I consent/).click();
  await page.getByRole("button", { name: /Send enquiry/ }).click();
  await expect(page.getByText(/Your message was not sent/)).toBeVisible();
  await expect(page.getByLabel("How can we help? *")).toHaveValue(
    "A new application",
  );
});
