import { test, expect } from "@playwright/test";

test.describe("contact form", () => {
  test("submits from homepage and reaches success page", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Message sent successfully! I'll get back to you soon.",
        }),
      });
    });

    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeVisible();

    await page.getByLabel(/name/i).fill("Playwright Tester");
    await page.getByLabel(/email/i).fill("tester@example.com");
    await page.getByLabel(/subject/i).fill("Portfolio contact test");
    await page
      .getByLabel(/message/i)
      .fill("This is an automated end-to-end contact form test.");

    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page).toHaveURL(/\/success$/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: /message sent/i })
    ).toBeVisible();
  });
});
