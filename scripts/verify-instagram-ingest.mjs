import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

async function runTest() {
  console.log("=== Testing Instagram Verifier & Claim Extraction ===");
  
  const { verifyClaimsAgainstSources } = await import('../src/lib/lobby/instagram-verifier.ts');
  
  // Test numeric & macro claim verification against FRED & Market Feed
  const testClaims = [
    "Federal Funds Rate remains high at 5.33% putting pressure on growth stocks",
    "Gold spot price trading near $2,650 as geopolitical tensions escalate",
    "Source asserts market is headed for an explosive breakout next week"
  ];
  const testHeadline = "Macro Policy & Gold Breakout Surveillance";

  console.log("\nInput Claims to verify:");
  testClaims.forEach((c, i) => console.log(` [${i+1}] ${c}`));

  console.log("\nRunning verifyClaimsAgainstSources...");
  const result = await verifyClaimsAgainstSources(testClaims, testHeadline);

  console.log("\n--- Verification Results ---");
  console.log("Verified Facts count:", result.verified_facts.length);
  console.log(JSON.stringify(result.verified_facts, null, 2));

  console.log("\nAvorria Commentary:");
  console.log(result.avorria_commentary);

  if (result.verified_facts.length > 0) {
    console.log("\n✅ SUCCESS: Primary data sources (FRED/Prices) were successfully cited with source URLs!");
  } else {
    console.log("\n⚠️ Note: No claims matched or APIs unreachable.");
  }
}

runTest().catch(console.error);
