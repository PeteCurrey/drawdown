import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { LEGAL_CONFIG } from "@/config/legal";

async function runVerification() {
  console.log("=================================================");
  console.log("  SEO TECHNICAL REMEDIATION VERIFICATION SUITE   ");
  console.log("=================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`[PASS] Test ${totalTests}: ${testName}`);
    } else {
      console.error(`[FAIL] Test ${totalTests}: ${testName}`);
      if (detail) console.error(`       Detail: ${detail}`);
    }
  }

  // 1. Test Freeze Flag Environment Variable
  const freezeEnv = process.env.PROGRAMMATIC_SEO_PUBLISHING_ENABLED;
  assert(
    freezeEnv === "false" || freezeEnv === undefined,
    "Programmatic SEO publishing freeze flag set",
    `Current PROGRAMMATIC_SEO_PUBLISHING_ENABLED value: '${freezeEnv}'`
  );

  // 2. Test Robots.txt Output & Exclusions
  const robotsConfig = robots();
  const mainRule = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
  const disallowedPaths = mainRule?.disallow || [];

  assert(
    disallowedPaths.includes("/admin/") &&
    disallowedPaths.includes("/dashboard/") &&
    disallowedPaths.includes("/api/"),
    "Robots.txt contains private path disallow rules",
    `Disallowed list: ${JSON.stringify(disallowedPaths)}`
  );

  assert(
    robotsConfig.sitemap === "https://drawdown.trading/sitemap.xml",
    "Robots.txt references correct sitemap XML URL",
    `Sitemap URL: ${robotsConfig.sitemap}`
  );

  // 3. Test Sitemap Integrity
  try {
    const sitemapEntries = await sitemap();
    const urls = sitemapEntries.map((e) => e.url);

    // Assert no city/topic doorway URLs exist in sitemap
    const hasCityDoorways = urls.some((u) => u.includes("/learn-to-trade/") && u.split("/").length > 5);
    assert(
      !hasCityDoorways,
      "Sitemap excludes city/topic doorway pages under Phase 5 consolidation",
      `Found city doorway count in sitemap: ${urls.filter((u) => u.includes("/learn-to-trade/") && u.split("/").length > 5).length}`
    );

    // Assert redirect URL /brokers is NOT in sitemap, but canonical /brokers/all IS
    const hasBrokersRedirectUrl = urls.includes("https://drawdown.trading/brokers");
    const hasBrokersCanonicalUrl = urls.includes("https://drawdown.trading/brokers/all");

    assert(
      !hasBrokersRedirectUrl,
      "Sitemap excludes redirect URL (/brokers)",
      "Found https://drawdown.trading/brokers in sitemap"
    );

    assert(
      hasBrokersCanonicalUrl,
      "Sitemap includes canonical URL (/brokers/all)",
      "Missing https://drawdown.trading/brokers/all in sitemap"
    );

    // Assert no duplicate URLs
    const uniqueUrls = new Set(urls);
    assert(
      uniqueUrls.size === urls.length,
      "Sitemap has 0 duplicate URLs",
      `Total: ${urls.length}, Unique: ${uniqueUrls.size}`
    );

  } catch (err: any) {
    assert(false, "Sitemap generation executed without throwing errors", err?.message);
  }

  // 4. Test Legal Entity Central Configuration
  assert(
    LEGAL_CONFIG.contractingEntity === "Black & Rowan Management Group Limited" &&
    LEGAL_CONFIG.fullTradingEntity === "Black & Rowan Management Group Limited t/a Drawdown" &&
    LEGAL_CONFIG.tradingAddress === "Chesterfield, Derbyshire, United Kingdom",
    "Central Legal Configuration is accurate and intact",
    `Trading Entity: ${LEGAL_CONFIG.fullTradingEntity}`
  );

  console.log("\n-------------------------------------------------");
  console.log(`  RESULT: ${passedTests}/${totalTests} tests passed.`);
  console.log("-------------------------------------------------\n");

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification();
