import { expect, test } from '@playwright/test';

test.describe('Tool - Crop image', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crop-image');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Crop image - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
