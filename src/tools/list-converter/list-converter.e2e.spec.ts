import { expect, test } from '@playwright/test';

test.describe('Tool - List converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/list-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('List converter - IT Tools');
  });

  test('Simple list should be converted with default settings', async ({ page }) => {
    await page.getByTestId('input').fill(`1
    2
    3
    4
    5`);

    const result = await page.getByTestId('area-content').innerText();

    expect(result.trim()).toEqual('1, 2, 3, 4, 5');
  });

  test('Duplicates should be removed, list should not be sorted and prefix and suffix list items', async ({ page }) => {
    await page.getByTestId('input').fill(`1
    2
    2
    4
    4
    3
    5`);
    await page.getByTestId('removeDuplicates').check();
    await page.getByTestId('itemPrefix').fill('\'');
    await page.getByTestId('itemSuffix').fill('\'');

    const result = await page.getByTestId('area-content').innerText();
    expect(result.trim()).toEqual('\'1\', \'2\', \'4\', \'3\', \'5\'');
  });

  test('List input should be converted to column output and strip wrappers', async ({ page }) => {
    await page.getByTestId('input').fill('(\'test\',\'test2\')');
    await page.getByTestId('outputAsColumn').check();
    await page.getByTestId('splitBySeparator').fill(',');
    await page.getByTestId('itemPrefix').fill('\'');
    await page.getByTestId('itemSuffix').fill('\'');
    await page.getByTestId('listPrefix').fill('(');
    await page.getByTestId('listSuffix').fill(')');

    const result = await page.getByTestId('area-content').innerText();
    expect(result.trim()).toEqual('test\ntest2');
  });
});
