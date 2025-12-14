import { expect, test } from '@playwright/test';

test.describe('Tool - Amortization Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/amortization-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Amortization Calculator - IT Tools');
  });

  test('Calculates amortization schedule with default values', async ({ page }) => {
    const loanAmountInput = page.getByLabel('Loan Amount');
    const loanTermInput = page.getByLabel('Loan Term');
    const interestRateInput = page.getByLabel('Interest Rate');

    await expect(loanAmountInput).toHaveValue('200000');
    await expect(loanTermInput).toHaveValue('360');
    await expect(interestRateInput).toHaveValue('6');

    const monthlyPaymentCell = page.locator('tbody tr td').first();
    await expect(monthlyPaymentCell).toContainText('$1,199.10');

    const totalPaymentsCell = page.locator('tbody tr td').nth(1);
    await expect(totalPaymentsCell).toContainText('$431,676.38');
  });

  test('Updates calculation when loan amount changes', async ({ page }) => {
    const loanAmountInput = page.getByLabel('Loan Amount');

    await loanAmountInput.clear();
    await loanAmountInput.fill('100000');

    const monthlyPaymentCell = page.locator('tbody tr td').first();
    await expect(monthlyPaymentCell).toContainText('$599.55');

    const totalPaymentsCell = page.locator('tbody tr td').nth(1);
    await expect(totalPaymentsCell).toContainText('$215,838.19');
  });

  test('Updates calculation when loan term changes', async ({ page }) => {
    const loanTermInput = page.getByLabel('Loan Term');

    await loanTermInput.clear();
    await loanTermInput.fill('180');

    const monthlyPaymentCell = page.locator('tbody tr td').first();
    await expect(monthlyPaymentCell).toContainText('$1,687.71');
  });

  test('Updates calculation when interest rate changes', async ({ page }) => {
    const interestRateInput = page.getByLabel('Interest Rate');

    await interestRateInput.clear();
    await interestRateInput.fill('4.5');

    const monthlyPaymentCell = page.locator('tbody tr td').first();
    await expect(monthlyPaymentCell).toContainText('$1,013.37');
  });

  test('Displays amortization schedule table', async ({ page }) => {
    const scheduleTable = page.locator('table').nth(1);

    await expect(scheduleTable.locator('thead th').nth(0)).toContainText('Month');
    await expect(scheduleTable.locator('thead th').nth(1)).toContainText('Interest');
    await expect(scheduleTable.locator('thead th').nth(2)).toContainText('Principal');
    await expect(scheduleTable.locator('thead th').nth(3)).toContainText('Ending Balance');

    const firstMonthRow = scheduleTable.locator('tbody tr').first();
    await expect(firstMonthRow.locator('td').nth(0)).toContainText('1');
    await expect(firstMonthRow.locator('td').nth(1)).toContainText('$1,000.00');
    await expect(firstMonthRow.locator('td').nth(2)).toContainText('$199.10');
    await expect(firstMonthRow.locator('td').nth(3)).toContainText('$199,800.90');
  });

  test('Shows validation error for invalid loan amount', async ({ page }) => {
    const loanAmountInput = page.getByLabel('Loan Amount');

    await loanAmountInput.clear();
    await loanAmountInput.fill('-1000');
    await loanAmountInput.blur();

    await expect(page.locator('text=Loan amount must be a positive value')).toBeVisible();
  });

  test('Shows validation error for zero loan amount', async ({ page }) => {
    const loanAmountInput = page.getByLabel('Loan Amount');

    await loanAmountInput.clear();
    await loanAmountInput.fill('0');
    await loanAmountInput.blur();

    await expect(page.locator('text=Loan amount must be a positive value')).toBeVisible();
  });

  test('Shows validation error for non-integer loan term', async ({ page }) => {
    const loanTermInput = page.getByLabel('Loan Term');

    await loanTermInput.clear();
    await loanTermInput.fill('12.5');
    await loanTermInput.blur();

    await expect(page.locator('text=Loan term must be a positive integer')).toBeVisible();
  });

  test('Shows validation error for negative loan term', async ({ page }) => {
    const loanTermInput = page.getByLabel('Loan Term');

    await loanTermInput.clear();
    await loanTermInput.fill('-12');
    await loanTermInput.blur();

    await expect(page.locator('text=Loan term must be a positive integer')).toBeVisible();
  });

  test('Shows validation error for interest rate above 100', async ({ page }) => {
    const interestRateInput = page.getByLabel('Interest Rate');

    await interestRateInput.clear();
    await interestRateInput.fill('101');
    await interestRateInput.blur();

    await expect(page.locator('text=Interest rate must be a positive value between 0 and 100')).toBeVisible();
  });

  test('Shows validation error for zero interest rate', async ({ page }) => {
    const interestRateInput = page.getByLabel('Interest Rate');

    await interestRateInput.clear();
    await interestRateInput.fill('0');
    await interestRateInput.blur();

    await expect(page.locator('text=Interest rate must be a positive value between 0 and 100')).toBeVisible();
  });

  test('Hides results when inputs are invalid', async ({ page }) => {
    const loanAmountInput = page.getByLabel('Loan Amount');

    await loanAmountInput.clear();
    await loanAmountInput.fill('invalid');

    const resultsTable = page.locator('table').first();
    await expect(resultsTable).not.toBeVisible();
  });

  test('Calculates correctly for short-term loan', async ({ page }) => {
    const loanAmountInput = page.getByLabel('Loan Amount');
    const loanTermInput = page.getByLabel('Loan Term');
    const interestRateInput = page.getByLabel('Interest Rate');

    await loanAmountInput.clear();
    await loanAmountInput.fill('10000');
    await loanTermInput.clear();
    await loanTermInput.fill('12');
    await interestRateInput.clear();
    await interestRateInput.fill('12');

    const monthlyPaymentCell = page.locator('tbody tr td').first();
    await expect(monthlyPaymentCell).toContainText('$888.49');

    const scheduleTable = page.locator('table').nth(1);
    // Find the last month row (before the year summary row)
    const lastMonthRow = scheduleTable.locator('tbody tr').nth(11); // 12th month (0-indexed)
    await expect(lastMonthRow.locator('td').nth(0)).toContainText('12');
    await expect(lastMonthRow.locator('td').nth(3)).toContainText('$0.00');
  });

  test('Schedule shows decreasing balance over time', async ({ page }) => {
    const loanAmountInput = page.getByLabel('Loan Amount');
    const loanTermInput = page.getByLabel('Loan Term');

    await loanAmountInput.clear();
    await loanAmountInput.fill('50000');
    await loanTermInput.clear();
    await loanTermInput.fill('12');

    const scheduleTable = page.locator('table').nth(1);
    const firstBalance = await scheduleTable.locator('tbody tr').nth(0).locator('td').nth(3).textContent();
    const sixthBalance = await scheduleTable.locator('tbody tr').nth(5).locator('td').nth(3).textContent();
    // Get the last month row (12th month, index 11) before the year summary row
    const lastMonthBalance = await scheduleTable.locator('tbody tr').nth(11).locator('td').nth(3).textContent();

    // The values may contain country code in e2e tests
    const firstBalanceValue = Number.parseFloat(firstBalance!.replace(/[A-Za-z$,]/g, ''));
    const sixthBalanceValue = Number.parseFloat(sixthBalance!.replace(/[A-Za-z$,]/g, ''));
    const lastBalanceValue = Number.parseFloat(lastMonthBalance!.replace(/[A-Za-z$,]/g, ''));

    expect(firstBalanceValue).toBeGreaterThan(sixthBalanceValue);
    expect(sixthBalanceValue).toBeGreaterThan(lastBalanceValue);
    expect(lastBalanceValue).toBeCloseTo(0, 0);
  });
});
