import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const timezoneOutput = '.n-dynamic-input input[readonly]';

async function openConverterWithTimezone(page: Page, timezone: string) {
  await page.addInitScript(({ timezone }: { timezone: string }) => {
    localStorage.setItem('date-time-converter:timezones', JSON.stringify([{ name: timezone }]));
  }, { timezone });

  await page.goto('/date-converter');
}

test.describe('Date time converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/date-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Date-time converter - IT Tools');
  });

  test('Format is auto detected from a date and the date is correctly converted', async ({ page }) => {
    const initialFormat = await page.getByTestId('date-time-converter-format-select').innerText();
    expect(initialFormat.trim()).toEqual('Unix timestamp');

    await page.getByTestId('date-time-converter-input').fill('2023-04-12T23:10:24+02:00');

    const detectedFormat = await page.getByTestId('date-time-converter-format-select').innerText();
    expect(detectedFormat.trim()).toEqual('ISO 8601');

    expect((await page.getByTestId('JS locale date string').inputValue()).trim()).toEqual(
      'Wed Apr 12 2023 23:10:24 GMT+0200 (Central European Summer Time)',
    );
    expect((await page.getByTestId('ISO 8601').inputValue()).trim()).toEqual('2023-04-12T23:10:24+02:00');
    expect((await page.getByTestId('ISO 8601 UTC').inputValue()).trim()).toEqual('2023-04-12T21:10:24.000Z');
    expect((await page.getByTestId('ISO 9075').inputValue()).trim()).toEqual('2023-04-12 23:10:24');
    expect((await page.getByTestId('Unix timestamp').inputValue()).trim()).toEqual('1681333824');
    expect((await page.getByTestId('RFC 7231').inputValue()).trim()).toEqual('Wed, 12 Apr 2023 21:10:24 GMT');
    expect((await page.getByTestId('RFC 3339').inputValue()).trim()).toEqual('2023-04-12T23:10:24+02:00');
    expect((await page.getByTestId('Timestamp').inputValue()).trim()).toEqual('1681333824000');
    expect((await page.getByTestId('UTC format').inputValue()).trim()).toEqual('Wed, 12 Apr 2023 21:10:24 GMT');
    expect((await page.getByTestId('Mongo ObjectID').inputValue()).trim()).toEqual('64371e400000000000000000');
    expect((await page.getByTestId('Excel date/time').inputValue()).trim()).toEqual('45028.88222222222');
  });

  test.describe('DST-aware timezone conversion', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('about:blank');
    });

    [
      {
        expected: '2026-03-08T03:30:00-04:00',
        input: '2026-03-08T07:30:00Z',
        timezone: 'America/New_York',
      },
      {
        expected: '2026-04-15T13:30:00+01:00',
        input: '2026-04-15T12:30:00Z',
        timezone: 'Europe/London',
      },
      {
        expected: '2026-10-04T03:30:00+11:00',
        input: '2026-10-03T16:30:00Z',
        timezone: 'Australia/Sydney',
      },
      {
        expected: '2026-03-08T03:30:00-07:00',
        input: '2026-03-08T10:30:00Z',
        timezone: 'America/Los_Angeles',
      },
    ].forEach(({ expected, input, timezone }) => {
      test(`uses the correct DST offset for ${timezone}`, async ({ page }) => {
        await openConverterWithTimezone(page, timezone);
        await page.getByTestId('date-time-converter-input').fill(input);

        await expect(page.locator(timezoneOutput).first()).toHaveValue(expected);
      });
    });
  });
});
