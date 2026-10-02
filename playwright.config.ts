import { defineConfig, devices } from "@playwright/test";

/**
 * Drawdown Trading — Playwright Browser E2E Configuration
 *
 * Tests run against the live production deployment at https://drawdown.trading
 * Three viewport profiles:
 *   - desktop:    1440 × 900   (standard widescreen)
 *   - mobile-375: 375 × 812    (iPhone SE / small Android)
 *   - mobile-390: 390 × 844    (iPhone 14 / modern mid-size)
 *
 * Screenshots are saved to docs/screenshots/ for the release evidence record.
 */
export default defineConfig({
  testDir: "./e2e",
  outputDir: "./docs/screenshots/playwright-output",
  fullyParallel: false,
  retries: 0,
  timeout: 75_000,

  reporter: [
    ["list"],
    ["json", { outputFile: "docs/playwright-results.json" }],
  ],

  use: {
    baseURL: "https://drawdown.trading",
    screenshot: "on",
    trace: "retain-on-failure",
    actionTimeout: 20_000,
    navigationTimeout: 35_000,
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    },
  },

  projects: [
    {
      name: "desktop",
      use: {
        defaultBrowserType: "chromium",
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile-375",
      use: {
        defaultBrowserType: "chromium",
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "mobile-390",
      use: {
        defaultBrowserType: "chromium",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
