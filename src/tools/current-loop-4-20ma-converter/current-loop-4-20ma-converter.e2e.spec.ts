import { expect, test } from '@playwright/test';

test.describe('Tool - 4-20 mA converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/current-loop-4-20ma-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('4-20 mA converter - IT Tools');
  });

  test('Converts a current into an engineering value', async ({ page }) => {
    await page.getByTestId('converter-input').locator('input').fill('8');
    await page.getByTestId('converter-input').locator('input').press('Enter');
    await expect(page.getByTestId('converter-output')).toHaveText('2.5 bar');
    await expect(page.getByTestId('input-status')).toContainText('In range');
  });

  test('Swaps the direction and keeps the operating point', async ({ page }) => {
    await page.getByTestId('converter-input').locator('input').fill('16');
    await page.getByTestId('converter-input').locator('input').press('Enter');
    await expect(page.getByTestId('converter-output')).toHaveText('7.5 bar');

    await page.getByTestId('swap-direction').click();
    await expect(page.getByTestId('converter-input').locator('input')).toHaveValue('7.5');
    await expect(page.getByTestId('converter-output')).toHaveText('16 mA');
    await expect(page.getByTestId('formula').locator('input')).toHaveValue('signal = 1.6 × value + 4');

    await page.getByTestId('swap-direction').click();
  });

  test('Reports a NAMUR NE 43 loop failure', async ({ page }) => {
    await page.getByTestId('converter-input').locator('input').fill('2');
    await page.getByTestId('converter-input').locator('input').press('Enter');
    await expect(page.getByTestId('input-status')).toContainText('Low failure');
  });
});
