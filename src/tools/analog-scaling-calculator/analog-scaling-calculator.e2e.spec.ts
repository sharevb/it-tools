import { expect, test } from '@playwright/test';

test.describe('Tool - Analog scaling calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/analog-scaling-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Analog scaling calculator - IT Tools');
  });

  test('Scales a Siemens raw value', async ({ page }) => {
    await page.getByTestId('converter-input').locator('input').fill('20736');
    await page.getByTestId('converter-input').locator('input').press('Enter');
    await expect(page.getByTestId('converter-output')).toHaveText('75 %');
    await expect(page.getByTestId('formula').locator('input')).toHaveValue('value = 0.003616898148 × signal');
  });

  test('Gives the rounded raw value in the other direction', async ({ page }) => {
    await page.getByTestId('swap-direction').click();
    await page.getByTestId('converter-input').locator('input').fill('33.3');
    await page.getByTestId('converter-input').locator('input').press('Enter');
    await expect(page.getByTestId('converter-output')).toHaveText('9206.784');
    await expect(page.getByTestId('converter-output-rounded')).toContainText('9207');
  });

  test('Rejects a range whose min is not lower than its max', async ({ page }) => {
    const min = page.getByTestId('engineering-min').locator('input');
    await min.fill('200');
    await min.press('Enter');
    await expect(page.getByText('The engineering min must be lower than the engineering max.')).toBeVisible();
    await expect(page.getByTestId('converter-output')).toHaveText('—');
    await expect(page.getByTestId('output-gauge')).toHaveCount(0);

    await min.fill('-50');
    await min.press('Enter');
    await expect(page.getByTestId('converter-output')).not.toHaveText('—');
  });
});
