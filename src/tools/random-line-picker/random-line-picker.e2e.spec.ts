import { expect, test } from '@playwright/test';

test.describe('Tool - Random Line Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/random-line-picker');

    await expect(page.getByTestId('input')).toBeVisible();
    await expect(page.getByTestId('count')).toBeVisible();
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Random Line Picker - IT Tools');
  });

  test('Picks random lines without repeats', async ({ page }) => {
    await page.getByTestId('input').fill('one\ntwo\nthree\nfour');

    const countInput = page.getByTestId('count').locator('input');
    await countInput.fill('2');
    await countInput.press('Enter');

    const picked = (await page.getByTestId('output').inputValue()).split('\n');

    expect(picked.length).toBe(2);
    expect(new Set(picked).size).toBe(2);
  });
});
