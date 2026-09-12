import fs from "fs";
import path from "path";

const PROHIBITED_PATTERNS = [
  // Execution/latency fabrications
  { pattern: /<1ms/i, label: "<1ms execution claim" },
  { pattern: /sub-1ms/i, label: "sub-1ms latency claim" },
  { pattern: /professional-grade execution/i, label: "professional-grade execution claim" },
  { pattern: /institutional-grade execution/i, label: "institutional-grade execution claim" },
  { pattern: /sub-100ms ultra-low latency/i, label: "ultra-low latency execution claim" },
  // Guaranteed performance (affirmative claims only, disclaimers stating "not guaranteed" or "no guaranteed" are allowed)
  { pattern: /(?<!(?:not|no|never|without)\s+)guaranteed\s+(?:win\s*rate|returns?|profits?)/i, label: "guaranteed return/win-rate claim" },
  // Unverified historical accuracy percentages (hardcoded stat claims)
  { pattern: /\b\d+%\s+historical reversal accuracy/i, label: "unverified historical accuracy percentage" },
  { pattern: /proven statistical edge/i, label: "proven statistical edge claim (requires evidence)" },
  // Tick-data specificity
  { pattern: /10\+ years of tick.data/i, label: "10+ years tick-data claim (not verified)" },
  { pattern: /decade-long historical data/i, label: "decade-long data claim (overstated precision)" },
  // Fabricated data source claims
  { pattern: /82% — HIGH/i, label: "hardcoded Acuity confidence score (fabricated)" },
  { pattern: /Machines spotted the breakout.*human analysts confirm/i, label: "hardcoded Acuity rationale (fabricated)" },
];

const SCAN_DIR = path.join(process.cwd(), "src");

function getFiles(dir: string): string[] {
  const subdirs = fs.readdirSync(dir);
  const files: string[] = [];

  for (const subdir of subdirs) {
    const res = path.join(dir, subdir);
    if (fs.statSync(res).isDirectory()) {
      files.push(...getFiles(res));
    } else if (/\.(tsx|ts|js|jsx|mdx)$/.test(res)) {
      files.push(res);
    }
  }

  return files;
}

function lintClaims() {
  console.log("🔍 Running Drawdown Claims Linter...");
  const files = getFiles(SCAN_DIR);
  let totalViolations = 0;

  for (const file of files) {
    // Skip config / status files that define prohibited term lists or fallbacks
    if (file.includes("product-status.ts") || file.includes("lint-claims") || file.includes("methodology")) {
      continue;
    }

    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Skip regulatory warning statements or economic bond definitions
      if (/affiliates must never|government bonds|risk-free rate/i.test(line)) {
        return;
      }
      for (const { pattern, label } of PROHIBITED_PATTERNS) {
        if (pattern.test(line)) {
          totalViolations++;
          const relativePath = path.relative(process.cwd(), file);
          console.error(`❌ [${label}] ${relativePath}:${index + 1}`);
          console.error(`   Line: "${line.trim()}"`);
        }
      }
    });
  }

  if (totalViolations > 0) {
    console.error(`\n❌ Claims Lint Failed! Found ${totalViolations} prohibited claim(s) in codebase.`);
    process.exit(1);
  } else {
    console.log("✅ Claims Lint Passed! No prohibited latency/execution claims found.");
    process.exit(0);
  }
}

lintClaims();
