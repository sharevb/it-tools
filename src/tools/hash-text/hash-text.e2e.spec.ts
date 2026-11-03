import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

test.describe('Tool - Hash text', () => {
  test('updates the added hashes when the digest encoding or input changes', async ({ page }) => {
    await page.goto('/hash-text?encoding=Hex');
    await page.getByPlaceholder('Your string to hash...').fill('hello world');

    const algorithms = [
      'ADLER32',
      'CRC32',
      'BLAKE2B',
      'BLAKE2S',
      'BLAKE3',
      'KECCAK',
      'XXHASH32',
      'XXHASH64',
      'XXHASH3',
      'XXHASH128',
      'SM3',
      'WHIRLPOOL',
    ];
    const digestInput = (algorithm: string) =>
      page
        .locator('.n-input-group')
        .filter({ has: page.getByText(algorithm, { exact: true }) })
        .getByRole('textbox');

    await expect(digestInput('ADLER32')).toHaveValue('1a0b045d');
    const hexDigests = new Map<string, string>();
    for (const algorithm of algorithms) {
      await expect(digestInput(algorithm)).toHaveValue(/^[0-9a-f]+$/);
      hexDigests.set(algorithm, await digestInput(algorithm).inputValue());
    }

    const encodings = [
      {
        label: 'Binary (base 2)',
        encode: (bytes: Buffer) => [...bytes].map((byte) => byte.toString(2).padStart(8, '0')).join(''),
      },
      { label: 'Base64 (base 64)', encode: (bytes: Buffer) => bytes.toString('base64') },
      { label: 'Base64url (base 64 with url safe chars)', encode: (bytes: Buffer) => bytes.toString('base64url') },
      { label: 'Hexadecimal (base 16)', encode: (bytes: Buffer) => bytes.toString('hex') },
    ];
    let currentLabel = 'Hexadecimal (base 16)';
    for (const { label, encode } of encodings) {
      await page.getByText(currentLabel, { exact: true }).and(page.locator('span')).click();
      await page.getByText(label, { exact: true }).and(page.locator('.c-select-dropdown-option')).click();
      for (const algorithm of algorithms) {
        await expect(digestInput(algorithm)).toHaveValue(encode(Buffer.from(hexDigests.get(algorithm)!, 'hex')));
      }
      currentLabel = label;
    }

    await page.getByPlaceholder('Your string to hash...').fill('abc');
    await expect(digestInput('ADLER32')).toHaveValue('024d0127');
  });
});
