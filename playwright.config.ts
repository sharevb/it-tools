import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// `pnpm preview` serves the production build here, and Playwright starts it
// itself. Point E2E_BASE_URL somewhere else -- a running `pnpm dev`, a deployed
// preview -- and that is taken as "I am supplying the server", so Playwright
// leaves the lifecycle alone.
//
// Deliberately not BASE_URL: vite.config.ts already reads that as the app's
// base path (`/it-tools/`), so sharing the name would make one value mean two
// incompatible things.
const previewUrl = 'http://localhost:5050';
const baseUrl = process.env.E2E_BASE_URL || previewUrl;
const useWebServer = baseUrl === previewUrl;

// What the browser sees is pinned by `timezoneId` below, and the specs do no
// date maths of their own, so today this changes nothing. It keeps the runner
// deterministic if a spec ever does compute a date on the node side.
process.env.TZ = 'UTC';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src',
  testMatch: /\.e2e\.(spec\.)?ts$/,
  /* First paint of heavy lazy-loaded tools can exceed the 5s default on
     slow CI browsers (webkit especially). Three workers share a runner, so
     first paint is slower still and CI needs more headroom than a local run.
     The test timeout has to stay above the expect timeout, otherwise it fires
     first and reports a timeout instead of the assertion that actually failed. */
  timeout: isCI ? 60_000 : 30_000,
  expect: { timeout: isCI ? 30_000 : 15_000 },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* CI runs one browser per job on a 4-core runner. Three workers saturates it
     (measured ~95% busy); a fourth adds nothing and leaves no core for the
     preview server. */
  workers: isCI ? 3 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    testIdAttribute: 'data-test-id',
    locale: 'en-GB',
    timezoneId: 'Europe/Paris',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */

  ...(useWebServer && {
    webServer: {
      command: 'pnpm preview',
      url: previewUrl,
      reuseExistingServer: !isCI,
    },
  }),
});
