import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("PROMPT SC6: ScannerClient implements diff engine, 50ms stagger ladder, AnimatedPrice, and ChangeBadge", () => {
  const filePath = path.join(process.cwd(), "src/components/dashboard/ScannerClient.tsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Step 1: Diff engine with prev snapshot ref and changedSlugs
  assert.ok(content.includes("prevPriceDataRef = useRef<Record<string, { price: number | null; change_pct: number | null }>>({})"));
  assert.ok(content.includes("const [changedSlugs, setChangedSlugs] = useState<Map<string, \"up\" | \"down\">>(new Map())"));
  assert.ok(content.includes("ALL_SLUGS.forEach((slug) => {"));

  // Step 2: 50ms stagger ladder and 950ms clear
  assert.ok(content.includes("staggerTimeoutsRef = useRef<NodeJS.Timeout[]>([])"));
  assert.ok(content.includes("index * 50"));
  assert.ok(content.includes("clearTimer = setTimeout"));
  assert.ok(content.includes("950"));

  // Step 2: AnimatedPrice and ChangeBadge components
  assert.ok(content.includes("function AnimatedPrice({"));
  assert.ok(content.includes("function ChangeBadge({"));
  assert.ok(content.includes("animate(prev, price"));
  assert.ok(content.includes("animate(prev, changePct"));

  // Step 2: Row/card flash animation with motion.div
  assert.ok(content.includes("<motion.div"));
  assert.ok(content.includes("rgba(24, 184, 128, 0.18)"));
  assert.ok(content.includes("rgba(206, 105, 105, 0.18)"));
  assert.ok(content.includes("duration: 0.9, ease: \"easeOut\""));

  // Step 4: Live freshness indicator in MarketStatusBar
  assert.ok(content.includes("isFresh ? \"bg-emerald-500 animate-pulse opacity-100\" : \"bg-slate-400 opacity-40\""));
  assert.ok(content.includes("35_000"));

  // Reduced motion support
  assert.ok(content.includes("useReducedMotion"));
});

test("PROMPT SC6: CorrelationMatrix implements >0.05 shift detection and cell glow pulse", () => {
  const filePath = path.join(process.cwd(), "src/components/dashboard/scanner/CorrelationMatrix.tsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Step 3: Shift tracking ref and map
  assert.ok(content.includes("prevMatrixRef = useRef<Record<string, Record<string, number>>>({})"));
  assert.ok(content.includes("const [shiftedCells, setShiftedCells] = useState<Map<string, \"up\" | \"down\">>(new Map())"));
  assert.ok(content.includes("Math.abs(currentVal - prevVal) >= 0.05"));

  // Step 3: motion.td with 900ms glow
  assert.ok(content.includes("<motion.td"));
  assert.ok(content.includes("rgba(24, 184, 128, 0.25)"));
  assert.ok(content.includes("rgba(206, 105, 105, 0.25)"));
  assert.ok(content.includes("duration: 0.9, ease: \"easeOut\""));

  // Reduced motion support
  assert.ok(content.includes("useReducedMotion"));
});
