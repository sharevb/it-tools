import { expect, test } from '@playwright/test';

test.describe('Tool - 0-10 V converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/voltage-0-10v-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('0-10 V converter - IT Tools');
  });

  test('Converts a voltage into an engineering value', async ({ page }) => {
    await page.getByTestId('converter-input').locator('input').fill('2.5');
    await page.getByTestId('converter-input').locator('input').press('Enter');
    await expect(page.getByTestId('converter-output')).toHaveText('25 %');
  });

  test('Warns below the live zero of a 2-10 V signal', async ({ page }) => {
    await page.getByTestId('signal-min').locator('input').fill('2');
    await page.getByTestId('signal-min').locator('input').press('Enter');
    await page.getByTestId('converter-input').locator('input').fill('1');
    await page.getByTestId('converter-input').locator('input').press('Enter');
    await expect(page.getByTestId('input-status')).toContainText('live zero');
  });
});
