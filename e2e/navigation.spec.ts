import { test, expect } from "@playwright/test";

test.describe("navigation smoke", () => {
  test("home, projects, blog, and contact all load", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Next.js Developer" })
    ).toBeVisible();

    await page.goto("/projects");
    await expect(
      page.getByRole("heading", { level: 1, name: /featured\s+projects/i })
    ).toBeVisible();

    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { level: 1, name: /blog\s+articles/i })
    ).toBeVisible();

    await page.goto("/#contact");
    await expect(
      page.getByRole("heading", { name: /let'?s connect/i })
    ).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });
});
