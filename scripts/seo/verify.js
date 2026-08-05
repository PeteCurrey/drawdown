const fs = require("fs");
const path = require("path");

console.log("=================================================");
console.log("  SEO & AUTHORITY REMEDIATION VERIFICATION SUITE ");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, detail) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] Test ${totalTests}: ${testName}`);
  } else {
    console.error(`[FAIL] Test ${totalTests}: ${testName}`);
    if (detail) console.error(`       Detail: ${detail}`);
  }
}

// 1. Verify Freeze Flag in .env.local
const envContent = fs.readFileSync(".env.local", "utf-8");
assert(
  envContent.includes("PROGRAMMATIC_SEO_PUBLISHING_ENABLED=false"),
  "Freeze flag set to false in .env.local",
  "PROGRAMMATIC_SEO_PUBLISHING_ENABLED=false missing"
);

// 2. Verify Research Centre Architecture
assert(
  fs.existsSync("src/app/(marketing)/research/page.tsx") &&
  fs.existsSync("src/app/(marketing)/research/methodology/page.tsx") &&
  fs.existsSync("src/app/(marketing)/research/datasets/page.tsx") &&
  fs.existsSync("src/app/(marketing)/research/broker-testing/page.tsx") &&
  fs.existsSync("src/app/(marketing)/research/trading-costs/page.tsx") &&
  fs.existsSync("src/app/(marketing)/research/risk/page.tsx") &&
  fs.existsSync("src/app/(marketing)/research/prop-firms/page.tsx") &&
  fs.existsSync("src/app/(marketing)/research/corrections/page.tsx") &&
  fs.existsSync("src/app/(marketing)/research/media/page.tsx"),
  "Research Centre routes hierarchy created (/research + 8 sub-hubs)",
  "Research route files missing"
);

// 3. Verify Calculator Assets & Embed Components
assert(
  fs.existsSync("src/components/calculators/DrawdownRecoveryCalculator.tsx") &&
  fs.existsSync("src/components/calculators/RiskOfRuinSimulator.tsx") &&
  fs.existsSync("src/components/calculators/PropFirmChallengeCalculator.tsx") &&
  fs.existsSync("src/components/calculators/EmbedWidgetModal.tsx"),
  "Calculator assets & embed widget components exist",
  "Calculator components missing"
);

// 4. Verify Editorial Policy & Report Error Routes
assert(
  fs.existsSync("src/app/(marketing)/editorial-policy/page.tsx") &&
  fs.existsSync("src/app/(marketing)/report-an-error/page.tsx") &&
  fs.existsSync("src/components/seo/ContentUpdateHistory.tsx"),
  "Editorial transparency, error reporting, and versioning components exist",
  "Editorial transparency files missing"
);

// 5. Verify Strategic Audit Artifacts & Roadmap CSVs
assert(
  fs.existsSync("seo-audit/research-roadmap.csv") &&
  fs.existsSync("seo-audit/research-data-requirements.md") &&
  fs.existsSync("seo-audit/topic-cluster-map.csv") &&
  fs.existsSync("seo-audit/editorial-brief-template.md") &&
  fs.existsSync("seo-audit/digital-pr-outreach-tracker.csv") &&
  fs.existsSync("seo-audit/authority-measurement-spec.md"),
  "Strategic audit CSVs & governance specifications generated",
  "Strategic audit files missing"
);

// 6. Verify Sitemap Overhaul Includes Research Routes
const sitemapContent = fs.readFileSync("src/app/sitemap.ts", "utf-8");
assert(
  sitemapContent.includes('"/research"') &&
  sitemapContent.includes('"/research/methodology"') &&
  sitemapContent.includes('"/research/datasets"') &&
  sitemapContent.includes('"/editorial-policy"') &&
  sitemapContent.includes('"/report-an-error"'),
  "Sitemap includes canonical Research Centre & Editorial routes",
  "Sitemap missing research routes"
);

// 7. Verify Legal Config Centralization
const legalConfigContent = fs.readFileSync("src/config/legal.ts", "utf-8");
assert(
  legalConfigContent.includes('contractingEntity: "Black & Rowan Management Group Limited"') &&
  legalConfigContent.includes('tradingAddress: "Chesterfield, Derbyshire, United Kingdom"'),
  "Legal config contains verified entity name and operating address",
  "Legal config missing entity details"
);

console.log("\n-------------------------------------------------");
console.log(`  RESULT: ${passedTests}/${totalTests} tests passed.`);
console.log("-------------------------------------------------\n");

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
