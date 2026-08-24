import { expect, test } from '@playwright/test';

test.describe('Tool - JSON to .env', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-env');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON to .env - IT Tools');
  });

  test('Provided JSON is converted to .env', async ({ page }) => {
    await page.getByTestId('input').fill(`{
  "ACCESS_KEY": "mySecretAccessKey",
  "AMQP_DNS": "amqp://a:b@rabbit/po",
  "APP_ENV": "prod"
}`);

    const generated = await page.getByTestId('area-content').innerText();

    expect(generated.trim()).toEqual(
      `ACCESS_KEY=mySecretAccessKey
AMQP_DNS=amqp://a:b@rabbit/po
APP_ENV=prod`.trim(),
    );
  });
});
