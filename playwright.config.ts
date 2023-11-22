import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { json } from 'stream/consumers';
export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// Read from default ".env" file.
dotenv.config();
// Alternatively, read from "../my.env" file.
dotenv.config({ path: path.resolve(__dirname, '..', 'my.env') });

export default defineConfig({
  timeout: 60000, // Timeout is shared between all tests.
  testDir: './tests',
  testMatch: ["tests/first_test.test.ts"],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. Limit the number of workers on CI, use default locally*/
  workers: process.env.CI ? 2 : undefined,
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results',
  // path to the global setup files.
  globalSetup: require.resolve('./global-setup'),
  // path to the global teardown files.
  globalTeardown: require.resolve('./global-teardown'),
  // Each test is given 30 seconds.
  timeout: 30000,
  // lets you write better assertions for end-to-end testing
  // Limit the number of failures on CI to save resources
    // maxFailures: process.env.CI ? 10 : undefined,
  expect: {
    // Maximum time expect() should wait for the condition to be met.
    timeout: 5000,
    toHaveScreenshot: {
      // An acceptable amount of pixels that could be different, unset by default.
      maxDiffPixels: 10,
    },
    toMatchSnapshot: {
      // An acceptable ratio of pixels that are different to the
      // total amount of pixels, between 0 and 1.
      maxDiffPixelRatio: 0.1,
    },
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.STAGING === '1' ? 'http://127.0.0.1:3000' : 'http://example.test/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Populates context with given storage state.
    storageState: 'state.json',
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    // Emulates the user locale.
    locale: 'en-GB',
    // Grants specified permissions to the browser context.
    permissions: ['geolocation','Notification'],
    // Emulates the user timezone.
    timezoneId: 'Europe/Paris',
    // Create a context with options inherited from the config
    userAgent: 'some custom ua',
    // Viewport used for all pages in the context.
    viewport: { width: 1280, height: 720 },
    // Change the default data-testid attribute.
    testIdAttribute: 'pw-test-id',
     // Maximum time each action such as `click()` can take. Defaults to 0 (no limit).
     actionTimeout: 0,
     // Name of the browser that runs tests. For example `chromium`, `firefox`, `webkit`.
     browserName: 'chromium',
     // Toggles bypassing Content-Security-Policy.
     bypassCSP: true,
     // Channel to use, for example "chrome", "chrome-beta", "msedge", "msedge-beta".
     channel: 'chrome',
    // Emulates `'prefers-colors-scheme'` media feature.
    colorScheme: 'dark',
// Put into launchOptions or contextOptions respectively in the use section.
    launchOptions: {
      slowMo: 50,
    },
     // Whether to automatically download all the attachments.
    acceptDownloads: false,
     // An object containing additional HTTP headers to be sent with every request.
     extraHTTPHeaders: {
     'X-My-Header': 'value',
        },
     // Credentials for HTTP authentication.
     httpCredentials: {
     username: 'user',
     password: 'pass',
        },
        // Whether to ignore HTTPS errors during navigation.
        ignoreHTTPSErrors: true,
        // Whether to emulate network being offline.
        offline: true,
        // Proxy settings used for all pages in the test.
        proxy: {
          server: 'http://myproxy.com:3128',
          bypass: 'localhost',
        },
  },
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter:
  [
    ["dot"],
    ["json",{outputFile:"jsonOutputFile/outputFile.json"}],
    ["html",{open:'never',attachmentsBaseURL: 'https://external-storage.com/'}],
    ['list', { printSteps: true }],
    ['blob', { outputDir: 'my-report' }],
    ['junit', { outputFile: 'results.xml' }]
    ],
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
    /* Configure projects for major browsers */
    projects: [
      {
        name: 'setup',
        testMatch: /global.setup\.ts/,
      },
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
        dependencies: ['setup'],
      },
      {
        name: 'Smoke',
        testMatch: /.*smoke.spec.ts/,
        retries: 0,
      },
      {
        name: 'Default',
        testIgnore: /.*smoke.spec.ts/,
        retries: 2,
      },
      {
        name: 'logged in chromium',
        testMatch: '**/*.loggedin.spec.ts',
        dependencies: ['setup'],
        use: {
          ...devices['Desktop Chrome'],
          storageState: STORAGE_STATE,
        },
      },
      {
        name: 'logged out chromium',
        use: { ...devices['Desktop Chrome'] },
        testIgnore: ['**/*loggedin.spec.ts']
      },
      {
        name: 'cleanup db',
        testMatch: /global\.teardown\.ts/,
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] ,locale: 'de-DE',},
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
        fullyParallel: true,
      },
      /* Test against mobile viewports. */
      {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 5'],
        isMobile:false,        
        // It is important to define the `viewport` property after destructuring `devices`, 
        // since devices also define the `viewport` for that device.
        viewport: { width: 1280, height: 720 }, },
      },
      {
        name: 'Mobile Safari',
        use: { ...devices['iPhone 12'] },
        retries:2
      },
      /* Test against branded browsers. */
      {
        name: 'Microsoft Edge',
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
      },
      {
        name: 'Google Chrome',
        use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      },
    ],
});
