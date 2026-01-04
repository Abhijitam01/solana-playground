import { test, expect } from "@playwright/test";

test("landing loads and CTA points to playground", async ({ page }) => {
  await page.goto("/landing");

  await expect(
    page.getByRole("heading", { name: /build solana experiences/i })
  ).toBeVisible();

  const cta = page.getByRole("link", { name: /start in the playground/i });
  await expect(cta).toHaveAttribute("href", "/");
});


