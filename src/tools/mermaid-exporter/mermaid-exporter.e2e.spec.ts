import { expect, test } from '@playwright/test';

test.describe('Mermaid Diagram Renderer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mermaid-exporter');
  });

  test('should render the initial diagram', async ({ page }) => {
    const diagramContainer = page.locator('.viewport svg');
    // mermaid is a large lazy-loaded chunk; cold CI browsers (webkit
    // especially) can exceed the default 5s expect timeout
    await expect(diagramContainer).toBeVisible({ timeout: 30_000 });
    await expect(diagramContainer).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  test('should zoom from the toolbar and reset to 100%', async ({ page }) => {
    await expect(page.locator('.viewport svg')).toBeVisible({ timeout: 30_000 });

    // the default diagram is small enough to fit, so it starts at 1:1
    const zoomLevel = page.getByTestId('zoom-level');
    await expect(zoomLevel).toHaveText('100%');

    await page.getByTestId('zoom-in').click();
    await expect(zoomLevel).toHaveText('125%');

    await page.getByTestId('zoom-out').click();
    await expect(zoomLevel).toHaveText('100%');

    await page.getByTestId('zoom-in').click();
    await zoomLevel.click();
    await expect(zoomLevel).toHaveText('100%');
  });

  test('should pan with the keyboard once the preview is focused', async ({ page }) => {
    await expect(page.locator('.viewport svg')).toBeVisible({ timeout: 30_000 });

    const canvas = page.locator('.canvas');
    const before = await canvas.evaluate(el => getComputedStyle(el).transform);

    await page.locator('.viewport').focus();
    await page.keyboard.press('ArrowRight');

    await expect
      .poll(async () => canvas.evaluate(el => getComputedStyle(el).transform))
      .not.toBe(before);
  });

  test('should update diagram when user edits Mermaid code', async ({ page }) => {
    const input = page.getByLabel('Your Mermaid to convert:');
    const updatedMermaid = `
      graph LR
      X[Start] --> Y{Working?}
      Y -- Yes --> Z[Success!]
      Y -- No --> W[Fix again!]
    `;
    await input.fill(updatedMermaid);
    await page.waitForTimeout(500);

    const svg = page.locator('.viewport svg');
    await expect(svg).toContainText('Start');
    await expect(svg).toContainText('Success!');
  });

  test('should allow exporting in SVG, PNG, and JPG', async ({ page }) => {
    const formats = ['svg', 'png', 'jpg'];

    for (const format of formats) {
      const button = page.getByRole('button', { name: new RegExp(`Export as ${format}`, 'i') });
      await expect(button).toBeVisible();
      await button.click();
    }
  });

  test('should keep the last valid diagram but refuse to export it on a syntax error', async ({ page }) => {
    await expect(page.locator('.viewport svg')).toBeVisible({ timeout: 30_000 });

    await page.getByLabel('Your Mermaid to convert:').fill('graph TD\nA --> not valid {{{');

    // the rendered diagram stays on screen, flagged as out of date
    await expect(page.locator('.error-overlay')).toBeVisible();
    await expect(page.locator('.canvas.stale')).toBeVisible();
    await expect(page.locator('.viewport svg')).toBeVisible();

    // exporting now would hand back a file that does not match the code
    await expect(page.getByRole('button', { name: /Export as PNG/i })).toBeDisabled();
  });
});
