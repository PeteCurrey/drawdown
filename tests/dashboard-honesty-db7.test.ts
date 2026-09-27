import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function readFile(relPath: string) {
  return fs.readFileSync(path.join(process.cwd(), relPath), "utf-8");
}

test("DB7: Backtester implements server-side auth gate and Edge tier access control", () => {
  const backtesterPage = readFile("src/app/(platform)/dashboard/tools/backtester/page.tsx");

  // Must be an async Server Component (no "use client" on page.tsx)
  assert.ok(
    !backtesterPage.startsWith('"use client"') && !backtesterPage.startsWith("'use client'"),
    "backtester/page.tsx must be a Server Component without 'use client' directive"
  );
  assert.ok(
    backtesterPage.includes("export default async function BacktesterPage()"),
    "backtester/page.tsx must export an async Server Component"
  );

  // Must redirect unauthenticated users to login with redirect parameter
  assert.ok(
    backtesterPage.includes('redirect("/login?redirect=/dashboard/tools/backtester")'),
    "Must redirect unauthenticated users to login"
  );

  // Must enforce Edge tier gate via hasTierAccess
  assert.ok(
    backtesterPage.includes('hasTierAccess(tier, "edge", status)'),
    "Must check Edge tier access using hasTierAccess"
  );

  // Must render BacktesterLockedState for unauthorized tiers
  assert.ok(
    backtesterPage.includes("BacktesterLockedState"),
    "Must define and render BacktesterLockedState component"
  );
  assert.ok(
    backtesterPage.includes("EDGE ACCESS REQUIRED"),
    "Locked state must clearly state EDGE ACCESS REQUIRED"
  );
  assert.ok(
    backtesterPage.includes("Upgrade to Edge"),
    "Locked state must provide Upgrade to Edge CTA"
  );

  // Must extract live interactive logic to BacktesterClient
  assert.ok(
    backtesterPage.includes("<BacktesterClient />"),
    "Must only render BacktesterClient when authorized"
  );
  assert.ok(
    fs.existsSync(path.join(process.cwd(), "src/app/(platform)/dashboard/tools/backtester/BacktesterClient.tsx")),
    "BacktesterClient.tsx must exist"
  );

  const clientSource = readFile("src/app/(platform)/dashboard/tools/backtester/BacktesterClient.tsx");
  assert.ok(
    clientSource.includes('"use client"') || clientSource.includes("'use client'"),
    "BacktesterClient must be a client component"
  );
});
