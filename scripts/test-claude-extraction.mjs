import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

async function runClaudeTest() {
  console.log("=== Testing Claude Extraction ===");
  const { extractClaimsWithClaude } = await import('../src/lib/lobby/instagram-verifier.ts');

  const sampleCaption = `
Fed Chair Jerome Powell signals interest rates may stay restrictive through winter as inflation persists above 2.5%.
Meanwhile, Brent crude tests $82 per barrel and S&P 500 futures pull back 40 points in early European trading.
Watch the key support level at 5,420 into the US open!
`;

  console.log("Sending caption to Claude 3.5 Sonnet...");
  const result = await extractClaimsWithClaude({ caption: sampleCaption });
  console.log("\nClaude Extracted Result:");
  console.log(JSON.stringify(result, null, 2));

  if (result.headline && Array.isArray(result.claims) && result.claims.length > 0) {
    console.log("\n✅ SUCCESS: Claude extracted headline and factual claims without inference!");
  } else {
    console.log("\n❌ FAILED to extract expected structure.");
  }
}

runClaudeTest().catch(console.error);
