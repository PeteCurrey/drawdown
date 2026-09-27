const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { chromium } = require("playwright");
const { createClient } = require("@supabase/supabase-js");

const env = dotenv.parse(fs.readFileSync(".env.local"));
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const USER_ID = "13e85f81-60f8-4336-b378-027739d07a1d"; // qa-free-user@drawdown.trading
const USER_EMAIL = "qa-free-user@drawdown.trading";
const USER_PASSWORD = "QA!Free#2026SecureTest";

async function main() {
  const screenshotsDir = path.join(process.cwd(), "docs", "screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  try {
    console.log("1. Setting user to FOUNDATION tier...");
    await supabase.from("profiles").update({
      subscription_tier: "foundation",
      subscription_status: "active"
    }).eq("id", USER_ID);

    console.log("2. Launching browser...");
    const browser = await chromium.launch({
      headless: true,
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    console.log("3. Logging in on http://localhost:3000/login...");
    await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" });
    await page.fill('input[type="email"]', USER_EMAIL);
    await page.fill('input[type="password"]', USER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/dashboard.*/, { timeout: 25000 });
    console.log("Logged in successfully. Landed on:", page.url());

    console.log("4. Navigating to /dashboard/tools/backtester (Foundation tier)...");
    await page.goto("http://localhost:3000/dashboard/tools/backtester", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const lockedScreenshotPath = path.join(screenshotsDir, "backtester-foundation-locked.png");
    await page.screenshot({ path: lockedScreenshotPath, fullPage: true });
    console.log("Captured locked state screenshot:", lockedScreenshotPath);

    console.log("5. Updating user to EDGE tier...");
    await supabase.from("profiles").update({
      subscription_tier: "edge",
      subscription_status: "active"
    }).eq("id", USER_ID);

    console.log("6. Reloading /dashboard/tools/backtester (Edge tier)...");
    await page.goto("http://localhost:3000/dashboard/tools/backtester", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const edgeScreenshotPath = path.join(screenshotsDir, "backtester-edge-full-access.png");
    await page.screenshot({ path: edgeScreenshotPath, fullPage: true });
    console.log("Captured full access screenshot:", edgeScreenshotPath);

    await browser.close();
    console.log("Browser closed successfully.");
  } finally {
    console.log("7. Resetting user back to FREE tier...");
    await supabase.from("profiles").update({
      subscription_tier: "free",
      subscription_status: "active"
    }).eq("id", USER_ID);
    console.log("Done.");
  }
}

main().catch(err => {
  console.error("Error during capture:", err);
  process.exit(1);
});
