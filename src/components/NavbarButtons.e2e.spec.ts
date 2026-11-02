import { expect, test } from '@playwright/test';

for (const viewport of [
  { width: 320, height: 568 },
  { width: 667, height: 375 },
  { width: 1280, height: 720 },
]) {
  test.describe(`Language menu at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test('scrolls to the last language without scrolling the page or dismissing the menu', async ({ page }) => {
      await page.goto('/');

      if (viewport.width <= 700) {
        await page.getByRole('button', { name: 'Toggle menu', exact: true }).click();
      }

      await page.getByRole('button', { name: 'Language', exact: true }).click();

      const menu = page.locator('.n-dropdown-menu');
      await expect(menu).toBeVisible();
      await menu.evaluate(async (element) => {
        await Promise.all(element.getAnimations().map((animation) => animation.finished));
      });
      const bounds = await menu.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);

      const pageScroll = await page.evaluate(() => window.scrollY);
      // Move directly: locator.hover() may scroll the page to align a teleported menu.
      await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
      const lastLanguage = menu.getByText('繁體中文', { exact: true });
      await expect(async () => {
        await page.mouse.wheel(0, 300);
        await expect(lastLanguage).toBeInViewport({ ratio: 1, timeout: 500 });
      }).toPass({ timeout: 10_000 });
      await expect(menu).toBeVisible();
      expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);

      // A second gesture at the boundary must not chain to the page either.
      await page.mouse.wheel(0, 500);
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
      );
      await expect(menu).toBeVisible();
      expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
      await lastLanguage.click();
      await expect(menu).not.toBeVisible();
      await expect(page.getByRole('button', { name: '語言', exact: true })).toBeVisible();
    });
  });
}
