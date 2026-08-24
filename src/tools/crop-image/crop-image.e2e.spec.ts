import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

test.describe('Tool - Crop image', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      // eslint-disable-next-line no-console
      console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });
    page.on('pageerror', (err) => {
      // eslint-disable-next-line no-console
      console.log(`[BROWSER ERROR] ${err.message}`);
    });
    await page.goto('/crop-image');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Crop image - IT Tools');
  });

  test('Upload an image and interact with crop controls', async ({ page }) => {
    // Check that we start in upload mode
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // 1x1 transparent PNG buffer
    const pixelPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64',
    );

    // Upload the file
    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: pixelPng,
    });

    // Interactive cropper grid should now be visible
    const viewportBox = page.locator('.viewport-box');
    await expect(viewportBox).toBeVisible();

    // Check sliders exist for zooming and rotation
    const sliders = page.locator('.n-slider');
    await expect(sliders).toHaveCount(2);

    // Export button should be visible
    const exportButton = page.getByRole('button', { name: /Export & Download Cropped Image/i });
    await expect(exportButton).toBeVisible();

    // Change image button should be visible
    const changeImageButton = page.getByRole('button', { name: /Change Image/i });
    await expect(changeImageButton).toBeVisible();
  });
});
