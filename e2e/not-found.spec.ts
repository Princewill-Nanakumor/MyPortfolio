import { test, expect } from "@playwright/test";

test.describe("404 page", () => {
  test("unknown route shows custom not-found UI", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-xyz");
    expect(response?.status()).toBe(404);

    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /page not found/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /back to home/i })
    ).toBeVisible();
  });
});
