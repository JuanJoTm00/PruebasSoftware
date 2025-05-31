// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Directorio donde se encuentran tus tests
  testDir: './tests', // Asegúrate de que esto coincida con la carpeta que elegiste (ej. 'e2e' o 'tests')
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'], 
  /* Retry on CI only */
  retries: process.env['CI'] ? 2 : 0, 
  /* Opt out of parallel tests on CI. */
  workers: process.env['CI'] ? 1 : undefined, 
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4200', // Asegúrate de que esto coincida con donde ejecutas tu app (ng serve)

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },


  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'ng serve',
    url: 'http://localhost:4200',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env['CI'], 
  },
});