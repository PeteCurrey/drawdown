#!/usr/bin/env tsx
/**
 * Legal Routes Verification Script
 * Black & Rowan Management Group Limited t/a Drawdown
 *
 * Tests that all legal pages return HTTP 200 and contain the expected
 * server-rendered text (i.e. content is not hidden behind JS loading states).
 *
 * Usage:
 *   npx tsx scripts/test-legal-routes.ts [--base-url https://drawdown.trading]
 */

const BASE_URL = process.argv.includes("--base-url")
  ? process.argv[process.argv.indexOf("--base-url") + 1]
  : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface RouteCheck {
  path: string;
  label: string;
  requiredText: string[];
}

const LEGAL_ROUTES: RouteCheck[] = [
  {
    path: "/terms",
    label: "Terms and Conditions",
    requiredText: [
      "Black & Rowan Management Group Limited",
      "money-back guarantee",
      "Immediate Digital Supply",
      "England and Wales",
    ],
  },
  {
    path: "/privacy",
    label: "Privacy Policy",
    requiredText: [
      "UK GDPR",
      "Data Controller",
      "right to erasure",
      "Information Commissioner",
    ],
  },
  {
    path: "/cookies",
    label: "Cookie Policy",
    requiredText: [
      "PECR",
      "essential cookies",
      "analytics",
      "drawdown_cookie_consent",
    ],
  },
  {
    path: "/disclaimer",
    label: "Risk Disclaimer",
    requiredText: [
      "financial advice",
      "quantitative",
      "leveraged",
      "past performance",
    ],
  },
  {
    path: "/legal/financial-disclaimer",
    label: "Legal & Financial Disclaimer",
    requiredText: [
      "FCA",
      "not authorised",
      "general information",
    ],
  },
  {
    path: "/legal/subscription-and-refunds",
    label: "Subscriptions & Refunds",
    requiredText: [
      "7-day",
      "money-back",
      "automatic renewal",
      "cancellation",
    ],
  },
  {
    path: "/community-guidelines",
    label: "Community Guidelines",
    requiredText: [
      "financial advice",
      "market manipulation",
      "18",
      "Black & Rowan",
    ],
  },
  {
    path: "/about",
    label: "About",
    requiredText: ["2016", "Pete"],
  },
];

interface Result {
  path: string;
  label: string;
  status: number | "ERROR";
  ok: boolean;
  missingText: string[];
  error?: string;
}

async function checkRoute(route: RouteCheck): Promise<Result> {
  const url = `${BASE_URL}${route.path}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "DrawdownLegalVerifier/1.0" },
      // Follow redirects
      redirect: "follow",
    });

    const body = await res.text();
    const missing = route.requiredText.filter((text) => !body.includes(text));

    return {
      path: route.path,
      label: route.label,
      status: res.status,
      ok: res.ok && missing.length === 0,
      missingText: missing,
    };
  } catch (err: any) {
    return {
      path: route.path,
      label: route.label,
      status: "ERROR",
      ok: false,
      missingText: [],
      error: err.message,
    };
  }
}

async function main() {
  console.log(`\n🔍 Legal Route Verification — ${BASE_URL}\n`);
  console.log("─".repeat(70));

  const results = await Promise.all(LEGAL_ROUTES.map(checkRoute));

  let passed = 0;
  let failed = 0;

  for (const r of results) {
    const icon = r.ok ? "✅" : "❌";
    const statusStr = String(r.status).padStart(3, " ");
    console.log(`${icon} [${statusStr}] ${r.label.padEnd(40)} ${r.path}`);

    if (!r.ok) {
      failed++;
      if (r.error) {
        console.log(`       Error: ${r.error}`);
      }
      if (r.missingText.length > 0) {
        console.log(`       Missing server-rendered text:`);
        r.missingText.forEach((t) => console.log(`         • "${t}"`));
      }
    } else {
      passed++;
    }
  }

  console.log("─".repeat(70));
  console.log(`\nResults: ${passed} passed, ${failed} failed (${results.length} total)\n`);

  if (failed > 0) {
    console.error("❌ Legal route verification FAILED. Review the issues above.");
    process.exit(1);
  } else {
    console.log("✅ All legal routes verified successfully.");
    process.exit(0);
  }
}

main();
