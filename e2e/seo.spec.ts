import { test, expect } from "@playwright/test";

const SITE_URL = "https://princewillnanakumor.com";

test.describe("SEO metadata", () => {
  test("homepage has canonical and Open Graph tags", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      SITE_URL
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Nanakumor Princewill/i
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      SITE_URL
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /myPhoto\.jpg/
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );
  });

  test("robots.txt allows public pages and blocks admin/api", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();

    expect(body).toMatch(/Allow:\s*\//i);
    expect(body).toMatch(/Disallow:\s*\/admin/i);
    expect(body).toMatch(/Disallow:\s*\/api\//i);
    expect(body).toContain(`${SITE_URL}/sitemap.xml`);
  });

  test("sitemap.xml includes core routes", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();

    expect(body).toContain(`<loc>${SITE_URL}</loc>`);
    expect(body).toContain(`<loc>${SITE_URL}/blog</loc>`);
    expect(body).toContain(`<loc>${SITE_URL}/projects</loc>`);
    expect(body).toContain(
      `<loc>${SITE_URL}/projects/helix-ticketing-app</loc>`
    );
  });
});
