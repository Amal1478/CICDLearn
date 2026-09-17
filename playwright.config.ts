import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Read environment variables from config.properties file.
 */
const configPath = path.resolve(__dirname, 'config.properties');
const configContents = fs.readFileSync(configPath, 'utf8');
const appConfig: Record<string, string> = {};
configContents.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    appConfig[key.trim()] = value.join('=').trim();
  }
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  /* Run tests in files sequentially */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Run tests sequentially across 1 worker. */
  workers: 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['allure-playwright', { resultsDir: 'Reports/allure-results' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: appConfig['URL'],

    /* Pass HTTP Basic Authentication credentials for the popup */
    httpCredentials: {
      username: appConfig['USERNAME'],
      password: appConfig['PASSWORD']
    },

    /* Run browser in headed mode */
    headless: true,

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
});
