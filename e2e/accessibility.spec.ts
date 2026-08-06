import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

function formatViolations(
  violations: { id: string; impact?: string | null; help: string; nodes: unknown[] }[]
) {
  return violations
    .map(
      (v) =>
        `[${v.impact ?? "unknown"}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`
    )
    .join("\n");
}

test.describe("accessibility", () => {
  test("homepage has no serious axe violations", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(["color-contrast"])
      .analyze();

    expect(
      results.violations,
      formatViolations(results.violations)
    ).toEqual([]);
  });

  test("blog index has no serious axe violations", async ({ page }) => {
    await page.goto("/blog");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(["color-contrast"])
      .analyze();

    expect(
      results.violations,
      formatViolations(results.violations)
    ).toEqual([]);
  });
});
