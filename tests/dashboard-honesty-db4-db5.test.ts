import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function readFile(relPath: string) {
  return fs.readFileSync(path.join(process.cwd(), relPath), "utf-8");
}

// ─── DB4 Tests: Dead UI Elements ─────────────────────────────────────────────

test("DB4 Step 1: Backtester has functional Print / Save Report wired to window.print", () => {
  const backtester = fs.existsSync(path.join(process.cwd(), "src/app/(platform)/dashboard/tools/backtester/BacktesterClient.tsx"))
    ? readFile("src/app/(platform)/dashboard/tools/backtester/BacktesterClient.tsx")
    : readFile("src/app/(platform)/dashboard/tools/backtester/page.tsx");
  assert.ok(
    backtester.includes("Print / Save Report"),
    "Must have honest Print / Save Report label instead of dead Download PDF"
  );
  assert.ok(
    backtester.includes("window.print()"),
    "Must trigger window.print() on click"
  );
  assert.ok(
    !backtester.includes("Download Detailed Report (PDF)"),
    "Must not render dead Download Detailed Report (PDF) button"
  );
});

test("DB4 Step 2: Market Pulse removes dead menu, alert button, and expand stubs", () => {
  const marketPulse = readFile("src/app/(platform)/dashboard/market-intelligence/page.tsx");

  // Dead MoreHorizontal icon button removed
  assert.ok(
    !marketPulse.includes("<MoreHorizontal"),
    "Chart header must not render dead MoreHorizontal icon button"
  );

  // Dead Set Alert button removed from calendar rows
  assert.ok(
    !marketPulse.includes("Set Alert"),
    "Calendar row must not render dead Set Alert button"
  );

  // Dead onExpand callback stub removed
  assert.ok(
    !marketPulse.includes("onExpand: (ev: any) => void"),
    "CalEventRow must not declare unused onExpand stub"
  );
});

test("DB4 Step 3: Challenge Simulator wires Upload New CSV box to real CSV parser", () => {
  const simulator = readFile("src/app/(platform)/dashboard/simulator/page.tsx");

  // File input must exist and be wired
  assert.ok(
    simulator.includes('type="file"'),
    "Simulator must contain a file input for CSV uploads"
  );
  assert.ok(
    simulator.includes('accept=".csv"'),
    "Simulator file input must accept .csv files"
  );
  assert.ok(
    simulator.includes("parseTradeCSV"),
    "Simulator must import and invoke parseTradeCSV"
  );
  assert.ok(
    simulator.includes("handleCsvUpload"),
    "Simulator must handle CSV upload changes"
  );
  assert.ok(
    simulator.includes("csvInputRef"),
    "Simulator must trigger file input via ref on card click"
  );
});

// ─── DB5 Tests: Tools Hub Tier Accuracy ──────────────────────────────────────

test("DB5 Step 1: Tools Hub sets Technical Scanner to Foundation tier", () => {
  const toolsHub = readFile("src/app/(platform)/dashboard/tools/page.tsx");

  // Technical Scanner must be minTier: "foundation"
  const scannerBlock = toolsHub.match(/slug:\s*"technical-scanner"[\s\S]*?minTier:\s*"([^"]+)"/);
  assert.ok(scannerBlock, "technical-scanner entry must exist in appTools");
  assert.equal(
    scannerBlock[1],
    "foundation",
    "Technical Scanner must require foundation tier, matching its page access gate"
  );
});

test("DB5 Step 2: Tools Hub uses dynamic required tier in unlock button copy", () => {
  const toolsHub = readFile("src/app/(platform)/dashboard/tools/page.tsx");

  // Must not have hardcoded "Unlock with Edge+"
  assert.ok(
    !toolsHub.includes("Unlock with Edge+"),
    "Locked button must not hardcode 'Unlock with Edge+'"
  );

  // Must dynamically derive tier name from tool.minTier
  assert.ok(
    toolsHub.includes("Unlock with {tool.minTier"),
    "Locked button must derive tier name from tool.minTier"
  );
});

test("DB5 Step 3: Tools Hub Journal link points directly to /dashboard/journal", () => {
  const toolsHub = readFile("src/app/(platform)/dashboard/tools/page.tsx");

  // Must route journal directly without 307 redirect hop
  assert.ok(
    toolsHub.includes("tool.slug === 'journal' ? '/dashboard/journal'"),
    "Journal link must point directly to /dashboard/journal"
  );
});

test("DB5 Summary: All four gated tools have accurate minTier configuration", () => {
  const toolsHub = readFile("src/app/(platform)/dashboard/tools/page.tsx");

  // Check all four gated tools
  const journalMatch = toolsHub.match(/slug:\s*"journal"[\s\S]*?minTier:\s*"([^"]+)"/);
  const scannerMatch = toolsHub.match(/slug:\s*"technical-scanner"[\s\S]*?minTier:\s*"([^"]+)"/);
  const backtesterMatch = toolsHub.match(/slug:\s*"backtester"[\s\S]*?minTier:\s*"([^"]+)"/);
  const algoMatch = toolsHub.match(/slug:\s*"algo-builder"[\s\S]*?minTier:\s*"([^"]+)"/);

  assert.ok(journalMatch && journalMatch[1] === "foundation", "Journal must be foundation tier");
  assert.ok(scannerMatch && scannerMatch[1] === "foundation", "Scanner must be foundation tier");
  assert.ok(backtesterMatch && backtesterMatch[1] === "edge", "Backtester must be edge tier");
  assert.ok(algoMatch && algoMatch[1] === "floor", "Algo Builder must be floor tier");
});
