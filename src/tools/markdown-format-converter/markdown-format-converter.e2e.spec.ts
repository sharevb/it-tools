import { test, expect } from '@playwright/test';

test.describe('Tool - Format Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown-format-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Format Converter - IT Tools');
  });
});
