import fs from "fs";
import path from "path";

const PROHIBITED_PATTERNS = [
  { pattern: /<1ms/i, label: "<1ms execution claim" },
  { pattern: /sub-1ms/i, label: "sub-1ms latency claim" },
  { pattern: /professional-grade execution/i, label: "professional-grade execution claim" },
  { pattern: /institutional-grade execution/i, label: "institutional-grade execution claim" },
  // Only scan data/seo files for guaranteed return — not educational content or FCA warnings
  { pattern: /guaranteed win rate/i, label: "guaranteed win rate claim", excludeInPath: ["content/", "lib/data/"] },
  { pattern: /guaranteed return/i, label: "guaranteed return claim", excludeInPath: ["content/", "lib/data/"] },
  { pattern: /sub-100ms ultra-low latency/i, label: "ultra-low latency execution claim" }
];

const SCAN_DIR = path.join(process.cwd(), "src");

function getFiles(dir) {
  const subdirs = fs.readdirSync(dir);
  const files = [];

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
  console.log("🔍 Running Avorria Claims Linter...");
  const files = getFiles(SCAN_DIR);
  let totalViolations = 0;

  for (const file of files) {
    if (file.includes("product-status") || file.includes("lint-claims") || file.includes("methodology")) {
      continue;
    }

    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      for (const { pattern, label, excludeInPath } of PROHIBITED_PATTERNS) {
        // Skip this pattern if the file path matches any exclusion path
        const relativePath = path.relative(process.cwd(), file);
        if (excludeInPath && excludeInPath.some((ex) => relativePath.replace(/\\/g, "/").includes(ex))) {
          continue;
        }
        if (pattern.test(line)) {
          totalViolations++;
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
