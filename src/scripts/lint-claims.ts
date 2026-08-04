import fs from "fs";
import path from "path";

const PROHIBITED_PATTERNS = [
  { pattern: /<1ms/i, label: "<1ms execution claim" },
  { pattern: /sub-1ms/i, label: "sub-1ms latency claim" },
  { pattern: /professional-grade execution/i, label: "professional-grade execution claim" },
  { pattern: /institutional-grade execution/i, label: "institutional-grade execution claim" },
  { pattern: /guaranteed win rate/i, label: "guaranteed win rate claim" },
  { pattern: /guaranteed return/i, label: "guaranteed return claim" },
  { pattern: /sub-100ms ultra-low latency/i, label: "ultra-low latency execution claim" }
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
