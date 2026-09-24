import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("PROMPT SC5: PublicScreenerClient implements staggered tick waves", () => {
  const filePath = path.join(process.cwd(), "src/components/markets/PublicScreenerClient.tsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Step 3 check: Stagger ladder timeouts ref exists
  assert.ok(content.includes("staggerTimeoutsRef = useRef<NodeJS.Timeout[]>([])"));
  // Step 3 check: Delays staggered by 50ms increments
  assert.ok(content.includes("index * 50"));
  // Step 3 check: Auto-cleared after ~950ms per item
  assert.ok(content.includes("950"));
  // Step 3 check: Timeouts cleared on unmount
  assert.ok(content.includes("staggerTimeoutsRef.current.forEach((t) => clearTimeout(t))"));
});

test("PROMPT SC5: ScreenerHeatmap implements ambient scan sweep and first-paint stagger", () => {
  const filePath = path.join(process.cwd(), "src/components/markets/ScreenerHeatmap.tsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Step 1 check: Ambient scan sweep present with 4s loop
  assert.ok(content.includes("Ambient Scan Sweep"));
  assert.ok(content.includes('["-100%", "250%"]'));
  assert.ok(content.includes("repeat: Infinity"));
  assert.ok(content.includes("duration: 4"));
  assert.ok(content.includes("via-slate-400/[0.04]"));
  assert.ok(content.includes("pointer-events-none absolute inset-0 z-[5]"));

  // Step 4 check: Initial entrance stagger ~20ms
  assert.ok(content.includes("First-paint"));
  assert.ok(content.includes("index * 0.02"));
  assert.ok(content.includes("initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}"));
});

test("PROMPT SC5: ScreenerTable implements tweened AnimatedPrice and ChangeBadge", () => {
  const filePath = path.join(process.cwd(), "src/components/markets/ScreenerTable.tsx");
  const content = fs.readFileSync(filePath, "utf-8");

  // Step 2 check: AnimatedPrice uses animate() from framer-motion over 500ms
  assert.ok(content.includes("export function AnimatedPrice"));
  assert.ok(content.includes("animate(prev, price"));
  assert.ok(content.includes("duration: 0.5"));
  assert.ok(content.includes("controls.stop()"));

  // Step 2 check: ChangeBadge uses animate() over 500ms
  assert.ok(content.includes("animate(prev, changePct"));

  // Step 4 check: Table rows have 15ms stagger entrance
  assert.ok(content.includes("index * 0.015"));
  assert.ok(content.includes("initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}"));

  // Step 5 check: respects shouldReduceMotion
  assert.ok(content.includes("useReducedMotion"));
});
