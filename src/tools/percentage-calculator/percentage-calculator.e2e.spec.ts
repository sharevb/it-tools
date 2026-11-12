import { expect, test } from '@playwright/test';

test.describe('Tool - Percentage calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/percentage-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Percentage calculator - IT Tools');
  });

  test('Correctly works out percentages', async ({ page }) => {
    await page.getByTestId('percentageX').locator('input').pressSequentially('123\n');
    await page.getByTestId('percentageY').locator('input').pressSequentially('456\n');
    await expect(page.getByTestId('percentageResult').locator('input')).toHaveValue('560.88');

    await page.getByTestId('numberX').locator('input').pressSequentially('123\n');
    await page.getByTestId('numberY').locator('input').pressSequentially('456\n');
    await expect(page.getByTestId('numberResult').locator('input')).toHaveValue('26.973684210526315');

    await page.getByTestId('numberFrom').locator('input').pressSequentially('123\n');
    await page.getByTestId('numberTo').locator('input').pressSequentially('456\n');
    await expect(page.getByTestId('percentageIncreaseDecrease').locator('input')).toHaveValue('270.7317073170732');
  });

  test('Displays empty results for incomplete input', async ({ page }) => {
    await page.getByTestId('percentageX').locator('input').pressSequentially('123\n');
    await expect(page.getByTestId('percentageResult').locator('input')).toHaveValue('');

    await page.getByTestId('numberY').locator('input').pressSequentially('456\n');
    await expect(page.getByTestId('numberResult').locator('input')).toHaveValue('');

    await page.getByTestId('numberFrom').locator('input').pressSequentially('123\n');
    await expect(page.getByTestId('percentageIncreaseDecrease').locator('input')).toHaveValue('');
  });

  test('Displays empty results after an input is cleared', async ({ page }) => {
    await page.getByTestId('percentageX').locator('input').pressSequentially('40\n');
    await page.getByTestId('percentageY').locator('input').pressSequentially('50\n');
    await expect(page.getByTestId('percentageResult').locator('input')).toHaveValue('20');

    await page.getByTestId('numberFrom').locator('input').pressSequentially('40\n');
    await page.getByTestId('numberTo').locator('input').pressSequentially('46\n');
    await expect(page.getByTestId('percentageIncreaseDecrease').locator('input')).toHaveValue('15');

    await page.getByTestId('percentageY').locator('input').clear();
    await page.getByTestId('numberTo').locator('input').clear();
    await page.getByTestId('percentageX').locator('input').clear();
    await page.getByTestId('numberFrom').locator('input').clear();

    await expect(page.getByTestId('percentageResult').locator('input')).toHaveValue('');
    await expect(page.getByTestId('percentageIncreaseDecrease').locator('input')).toHaveValue('');
  });
});
